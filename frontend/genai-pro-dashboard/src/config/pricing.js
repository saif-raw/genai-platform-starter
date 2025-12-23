// frontend/genai-pro-dashboard/src/config/pricing.js

export const MODEL_PRICING = {
  "openai/gpt-oss-20b": {
    inputPer1M: 0.06394,  // Converted from 0.075 USD
    outputPer1M: 0.25576  // Converted from 0.30 USD
  },
  "llama-3.1-8b-instant": {
    inputPer1M: 0.04263,  // Converted from 0.05 USD
    outputPer1M: 0.06820  // Converted from 0.08 USD
  }
};

export function calculateCost({ model, inputTokens = 0, outputTokens = 0 }) {
  const price = MODEL_PRICING[model];
  if (!price) return 0;

  // Returns total cost in Euro
  return (
    (inputTokens / 1_000_000) * price.inputPer1M +
    (outputTokens / 1_000_000) * price.outputPer1M
  );
}