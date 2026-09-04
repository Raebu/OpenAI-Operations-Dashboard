import { z } from 'zod';

const sensitiveField = z.string().max(2000).optional().transform((value) => {
  if (!value) return value;
  if (process.env.TELEMETRY_PREVIEWS_ENABLED !== 'true') return undefined;
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/\b(?:sk|rk|pk)-[A-Za-z0-9_-]{16,}\b/g, '[redacted-key]')
    .replace(/\b\d{12,19}\b/g, '[redacted-number]');
});

export const ingestEventSchema = z.object({
  organisationId: z.string().min(2).max(128),
  application: z.string().min(1).max(128),
  environment: z.string().min(1).max(64).default('production'),
  provider: z.string().min(1).max(64).default('openai'),
  model: z.string().min(1).max(128),
  promptName: z.string().min(1).max(128),
  promptVersion: z.string().max(64).optional(),
  userId: z.string().max(256).optional(),
  requestId: z.string().max(256).optional(),
  inputTokens: z.number().int().min(0).max(100_000_000).default(0),
  outputTokens: z.number().int().min(0).max(100_000_000).default(0),
  cachedTokens: z.number().int().min(0).max(100_000_000).default(0),
  reasoningTokens: z.number().int().min(0).max(100_000_000).default(0),
  latencyMs: z.number().int().min(0).max(86_400_000),
  status: z.enum(['success', 'error', 'blocked', 'timeout', 'reviewed']),
  errorCode: z.string().max(128).optional(),
  safety: z.object({
    flagged: z.boolean().default(false),
    categories: z.array(z.string().max(128)).max(64).default([])
  }).default({ flagged: false, categories: [] }),
  quality: z.object({
    hallucinationRisk: z.number().min(0).max(1).optional(),
    groundedness: z.number().min(0).max(1).optional(),
    citationCoverage: z.number().min(0).max(1).optional()
  }).default({}),
  promptPreview: sensitiveField,
  responsePreview: sensitiveField,
  metadata: z.record(z.unknown()).optional()
});

export type IngestEventInput = z.infer<typeof ingestEventSchema>;
