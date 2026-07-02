import { describe, expect, it } from 'vitest';
import { ingestEventSchema } from '@/lib/validation';

describe('ingestEventSchema', () => {
  it('accepts a valid AI event payload', () => {
    const result = ingestEventSchema.safeParse({
      organisationId: 'org_demo',
      application: 'customer-support-copilot',
      model: 'gpt-4.1',
      promptName: 'answer-policy-question',
      inputTokens: 100,
      outputTokens: 50,
      cachedTokens: 10,
      reasoningTokens: 0,
      latencyMs: 800,
      status: 'success',
      quality: { hallucinationRisk: 0.1, groundedness: 0.9, citationCoverage: 0.8 }
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid quality scores', () => {
    const result = ingestEventSchema.safeParse({
      organisationId: 'org_demo',
      application: 'customer-support-copilot',
      model: 'gpt-4.1',
      promptName: 'answer-policy-question',
      latencyMs: 800,
      status: 'success',
      quality: { hallucinationRisk: 1.5 }
    });

    expect(result.success).toBe(false);
  });
});
