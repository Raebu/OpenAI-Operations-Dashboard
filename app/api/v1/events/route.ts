import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isValidIngestKey } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { estimateCostUsd } from '@/lib/pricing';
import { checkRateLimit } from '@/lib/rate-limit';
import { ingestEventSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rateLimit = checkRateLimit(`ingest:${ipAddress}`);

  if (!rateLimit.allowed) {
    logger.warn('ingest.rate_limited', { ipAddress });
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const apiKey = request.headers.get('x-api-key');
  if (!isValidIngestKey(apiKey)) {
    logger.warn('ingest.unauthorised', { ipAddress });
    return NextResponse.json({ error: 'Invalid or missing API key' }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = ingestEventSchema.safeParse(json);
  if (!parsed.success) {
    logger.warn('ingest.invalid_payload', { ipAddress });
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const estimatedCostUsd = estimateCostUsd(
    input.inputTokens,
    input.outputTokens,
    input.cachedTokens,
    input.reasoningTokens,
    input.model
  );

  await prisma.organisation.upsert({
    where: { id: input.organisationId },
    create: { id: input.organisationId, name: input.organisationId.replace(/_/g, ' '), slug: input.organisationId },
    update: {}
  });

  await prisma.application.upsert({
    where: {
      organisationId_name_environment: {
        organisationId: input.organisationId,
        name: input.application,
        environment: input.environment
      }
    },
    create: {
      organisationId: input.organisationId,
      name: input.application,
      environment: input.environment
    },
    update: {}
  });

  const event = await prisma.aiEvent.create({
    data: {
      organisationId: input.organisationId,
      application: input.application,
      environment: input.environment,
      provider: input.provider,
      model: input.model,
      promptName: input.promptName,
      promptVersion: input.promptVersion,
      userId: input.userId,
      requestId: input.requestId,
      inputTokens: input.inputTokens,
      outputTokens: input.outputTokens,
      cachedTokens: input.cachedTokens,
      reasoningTokens: input.reasoningTokens,
      estimatedCostUsd,
      latencyMs: input.latencyMs,
      status: input.status,
      errorCode: input.errorCode,
      safetyFlagged: input.safety.flagged,
      safetyCategories: input.safety.categories,
      hallucinationRisk: input.quality.hallucinationRisk,
      groundedness: input.quality.groundedness,
      citationCoverage: input.quality.citationCoverage,
      promptPreview: input.promptPreview,
      responsePreview: input.responsePreview,
      metadata: input.metadata
    }
  });

  if (input.safety.flagged || (input.quality.hallucinationRisk ?? 0) >= 0.6 || input.status === 'blocked') {
    await prisma.humanReview.create({
      data: {
        organisationId: input.organisationId,
        aiEventId: event.id,
        severity: input.safety.flagged ? 'high' : 'medium'
      }
    });
  }

  await prisma.auditLog.create({
    data: {
      organisationId: input.organisationId,
      actor: 'api-key',
      action: 'ai_event.ingested',
      targetType: 'AiEvent',
      targetId: event.id,
      ipAddress,
      userAgent: request.headers.get('user-agent') ?? undefined,
      metadata: { application: input.application, model: input.model, status: input.status }
    }
  });

  logger.info('ingest.created', { organisationId: input.organisationId, eventId: event.id, model: input.model });
  return NextResponse.json({ id: event.id, estimatedCostUsd }, { status: 201 });
}
