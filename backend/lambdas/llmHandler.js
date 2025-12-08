// backend/lambdas/llmHandler.js

const fakeProviders = {
  openai: async (payload) => {
    return {
      provider: "openai",
      model: payload.model || "gpt-4o",
      text: `<<FAKE OPENAI RESPONSE>> for prompt: ${payload.prompt?.slice(0,80) || ""}`,
      tokens_used: Math.max(1, Math.floor((payload.prompt?.length || 1) / 4))
    };
  },
  bedrock: async (payload) => {
    return {
      provider: "bedrock",
      model: payload.model || "claude-3",
      text: `<<FAKE BEDROCK RESPONSE>> for prompt: ${payload.prompt?.slice(0,80) || ""}`,
      tokens_used: Math.max(1, Math.floor((payload.prompt?.length || 1) / 3))
    };
  },
  fallback: async (payload) => {
    return {
      provider: "none",
      model: "none",
      text: `<<FAKE LOCAL RESPONSE>> echo: ${payload.prompt?.slice(0,120) || ""}`,
      tokens_used: Math.max(1, Math.floor((payload.prompt?.length || 1) / 6))
    };
  }
};

exports.route = async function routeToProvider({ payload }) {
  const providerKey = (payload.provider || "fallback").toLowerCase();
  const chosen = fakeProviders[providerKey] ? providerKey : "fallback";

  const result = await fakeProviders[chosen](payload);

  const usage = {
    timestamp: new Date().toISOString(),
    provider: result.provider,
    model: result.model,
    tokens: result.tokens_used,
    userId: payload.userId || "anonymous",
    projectId: payload.projectId || "default",
    prompt_snippet: (payload.prompt || "").slice(0, 256)
  };

  return { result, usage };
};
