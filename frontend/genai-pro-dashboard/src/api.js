// frontend/genai-pro-dashboard/src/api.js

const RAW_BASE = import.meta.env.VITE_API_BASE;
const API_BASE = RAW_BASE.replace(/\/$/, "");

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

  // 🔑 NORMALIZE BACKEND RESPONSE
  return {
    timestamp: new Date().toISOString(),
    result: {
      provider: json.provider,
      model: json.model,
      text: json.message
    },
    usage: json.usage || {}
  };
}

export async function fetchAdminUsage(lastN = 50, apiKey = null) {
  const url = `${API_BASE}/v1/admin/usage?limit=${lastN}`;
  const headers = apiKey ? { "x-api-key": apiKey } : {};
  const res = await fetch(url, { headers });
  return res.ok ? res.json() : null;
}
