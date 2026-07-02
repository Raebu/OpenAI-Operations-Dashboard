import { z } from 'zod';

export const ingestEventSchema = z.object({
  organisationId: z.string().min(2),
  application: z.string().min(1),
  environment: z.string().default('production'),
  provider: z.string().min(1).default('openai'),
  model: z.string().min(1),
  promptName: z.string().min(1),
  promptVersion: z.string().optional(),
  userId: z.string().optional(),
  requestId: z.string().optional(),
  inputTokens: z.number().int().min(0).default(0),
  outputTokens: z.number().int().min(0).default(0),
  cachedTokens: z.number().int().min(0).default(0),
  reasoningTokens: z.number().int().min(0).default(0),
  latencyMs: z.number().int().min(0),
  status: z.enum(['success', 'error', 'blocked', 'timeout', 'reviewed']),
  errorCode: z.string().optional(),
  safety: z.object({
    flagged: z.boolean().default(false),
    categories: z.array(z.string()).default([])
  }).default({ flagged: false, categories: [] }),
  quality: z.object({
    hallucinationRisk: z.number().min(0).max(1).optional(),
    groundedness: z.number().min(0).max(1).optional(),
    citationCoverage: z.number().min(0).max(1).optional()
  }).default({}),
  promptPreview: z.string().max(2000).optional(),
  responsePreview: z.string().max(2000).optional(),
  metadata: z.record(z.unknown()).optional()
});

export type IngestEventInput = z.infer<typeof ingestEventSchema>;
