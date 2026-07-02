import { PrismaClient } from '@prisma/client';
import { estimateCostUsd } from '../lib/pricing';

const prisma = new PrismaClient();

const apps = ['customer-support-copilot', 'legal-contract-review', 'sales-proposal-agent', 'internal-knowledge-assistant'];
const models = ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4o', 'gpt-4o-mini', 'o4-mini'];
const prompts = ['policy-answer', 'summarise-thread', 'draft-response', 'classify-risk', 'extract-actions'];

async function main() {
  await prisma.organisation.upsert({
    where: { id: 'org_demo' },
    create: { id: 'org_demo', name: 'Demo Enterprise', slug: 'org_demo' },
    update: {}
  });

  for (const app of apps) {
    await prisma.application.upsert({
      where: { organisationId_name_environment: { organisationId: 'org_demo', name: app, environment: 'production' } },
      create: { organisationId: 'org_demo', name: app, environment: 'production', owner: 'AI Governance Team' },
      update: {}
    });
  }

  await prisma.aiEvent.deleteMany({ where: { organisationId: 'org_demo' } });
  await prisma.auditLog.deleteMany({ where: { organisationId: 'org_demo' } });

  for (let i = 0; i < 220; i++) {
    const app = apps[i % apps.length];
    const model = models[i % models.length];
    const inputTokens = 400 + ((i * 37) % 3200);
    const outputTokens = 120 + ((i * 19) % 1300);
    const cachedTokens = i % 3 === 0 ? Math.floor(inputTokens * 0.25) : 0;
    const reasoningTokens = model.startsWith('o') ? 80 + ((i * 13) % 600) : 0;
    const hallucinationRisk = Number((((i * 7) % 100) / 100).toFixed(2));
    const flagged = i % 17 === 0 || hallucinationRisk > 0.82;
    const status = flagged && i % 2 === 0 ? 'blocked' : i % 29 === 0 ? 'error' : 'success';
    const createdAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * (i % 30));

    const event = await prisma.aiEvent.create({
      data: {
        organisationId: 'org_demo',
        application: app,
        environment: 'production',
        provider: 'openai',
        model,
        promptName: prompts[i % prompts.length],
        promptVersion: `1.${i % 5}.0`,
        userId: `user_${i % 18}`,
        requestId: `req_${i}`,
        inputTokens,
        outputTokens,
        cachedTokens,
        reasoningTokens,
        estimatedCostUsd: estimateCostUsd(inputTokens, outputTokens, cachedTokens, reasoningTokens, model),
        latencyMs: 450 + ((i * 97) % 4200),
        status,
        safetyFlagged: flagged,
        safetyCategories: flagged ? ['policy', i % 2 === 0 ? 'jailbreak' : 'sensitive_data'] : [],
        hallucinationRisk,
        groundedness: Number((1 - hallucinationRisk * 0.65).toFixed(2)),
        citationCoverage: Number((0.55 + ((i % 40) / 100)).toFixed(2)),
        promptPreview: 'Summarise and answer using only approved policy sources.',
        responsePreview: 'The assistant generated a response with governance telemetry captured.',
        metadata: { region: 'eu-west-2', channel: i % 2 === 0 ? 'api' : 'chat' },
        createdAt
      }
    });

    if (flagged || hallucinationRisk >= 0.6) {
      await prisma.humanReview.create({
        data: {
          organisationId: 'org_demo',
          aiEventId: event.id,
          status: 'pending',
          severity: flagged ? 'high' : 'medium'
        }
      });
    }

    if (i < 40) {
      await prisma.auditLog.create({
        data: {
          organisationId: 'org_demo',
          actor: i % 4 === 0 ? 'governance-admin' : 'api-key',
          action: i % 4 === 0 ? 'review.created' : 'ai_event.ingested',
          targetType: 'AiEvent',
          targetId: event.id,
          metadata: { model, app },
          createdAt
        }
      });
    }
  }
}

main().finally(async () => prisma.$disconnect());
