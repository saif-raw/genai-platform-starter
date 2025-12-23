// frontend/genai-pro-dashboard/src/api.js

const RAW_BASE = import.meta.env.VITE_API_BASE;
const API_BASE = RAW_BASE.replace(/\/$/, "");

/* -----------------------------
   GENERATE (LIVE CALL)
----------------------------- */

export async function callGenerate({
  prompt,
  provider,
  model,
  userId = "local-user",
  projectId = "dashboard"
}) {
  const url = `${API_BASE}/v1/hello`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, provider, model, userId, projectId })
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error || "Request failed");
  }

  // Normalize live response to UI shape
  return {
    timestamp: new Date().toISOString(),
    prompt,
    userId,
    projectId,
    result: {
      provider: json.provider,
      model: json.model,
      text: json.message
    },
    usage: {
      inputTokens: json.usage?.promptTokens ?? 0,
      outputTokens: json.usage?.completionTokens ?? 0,
      totalTokens: json.usage?.totalTokens ?? 0,
      latencyMs: json.usage?.latencyMs ?? 0
    }
  };
}

/* -----------------------------
   ADMIN FETCH (RAW)
----------------------------- */

export async function fetchAdminUsage(lastN = 50, apiKey = null) {
  const url = `${API_BASE}/v1/admin/usage?limit=${lastN}`;
  const headers = apiKey ? { "x-api-key": apiKey } : {};
  const res = await fetch(url, { headers });
  return res.ok ? res.json() : null;
}

/* -----------------------------
   NORMALIZER (DYNAMODB → UI)
----------------------------- */

export function normalizeAdminUsage(items = []) {
  return items.map(u => ({
    sessionId: u.sessionId || u.id || null,

    timestamp: u.timestamp,

    prompt: u.prompt ?? "[stored session]",

    userId: u.userId ?? "unknown",
    projectId: u.projectId ?? "unknown",

    result: {
      provider: u.provider ?? "unknown",
      model: u.model ?? "unknown",
      text: u.response ?? ""
    },

    usage: {
      inputTokens: u.inputTokens ?? 0,
      outputTokens: u.outputTokens ?? 0,
      totalTokens: u.totalTokens ?? 0,
      latencyMs: u.latencyMs ?? 0
    }
  }));
}
