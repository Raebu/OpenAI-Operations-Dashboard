export type ModelPrice = {
  inputPerMillion: number;
  outputPerMillion: number;
  cachedInputPerMillion?: number;
  reasoningPerMillion?: number;
};

export const MODEL_PRICING_USD: Record<string, ModelPrice> = {
  'gpt-4.1': { inputPerMillion: 2, outputPerMillion: 8, cachedInputPerMillion: 0.5 },
  'gpt-4.1-mini': { inputPerMillion: 0.4, outputPerMillion: 1.6, cachedInputPerMillion: 0.1 },
  'gpt-4o': { inputPerMillion: 2.5, outputPerMillion: 10, cachedInputPerMillion: 1.25 },
  'gpt-4o-mini': { inputPerMillion: 0.15, outputPerMillion: 0.6, cachedInputPerMillion: 0.075 },
  'o3': { inputPerMillion: 10, outputPerMillion: 40, cachedInputPerMillion: 2.5, reasoningPerMillion: 40 },
  'o4-mini': { inputPerMillion: 1.1, outputPerMillion: 4.4, cachedInputPerMillion: 0.275, reasoningPerMillion: 4.4 }
};

export function estimateCostUsd(inputTokens: number, outputTokens: number, cachedTokens: number, reasoningTokens: number, model: string) {
  const pricing = MODEL_PRICING_USD[model] ?? { inputPerMillion: 1, outputPerMillion: 3, cachedInputPerMillion: 0.25 };
  const billableInputTokens = Math.max(inputTokens - cachedTokens, 0);
  const inputCost = (billableInputTokens / 1_000_000) * pricing.inputPerMillion;
  const cachedCost = (cachedTokens / 1_000_000) * (pricing.cachedInputPerMillion ?? pricing.inputPerMillion);
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPerMillion;
  const reasoningCost = (reasoningTokens / 1_000_000) * (pricing.reasoningPerMillion ?? pricing.outputPerMillion);
  return Number((inputCost + cachedCost + outputCost + reasoningCost).toFixed(6));
}
