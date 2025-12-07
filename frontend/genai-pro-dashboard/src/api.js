// src/api.js
// Simple wrapper for calling your GenAI API.
// Update VITE_API_BASE in your environment or replace with endpoint string.

const API_BASE = import.meta.env.VITE_API_BASE || "https://oog4ijyedb.execute-api.ap-south-1.amazonaws.com/prod";

export async function callGenerate({ prompt, provider, model, userId = "local-user", projectId = "dashboard" }) {
  const url = `${API_BASE}/v1/hello`;
  const payload = { prompt, provider, model, userId, projectId };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  return { ok: res.ok, status: res.status, json };
}

// optional admin usage call if you implement it later
export async function fetchAdminUsage(lastN = 50, apiKey = null) {
  const url = `${API_BASE}/v1/admin/usage?limit=${lastN}`;
  const headers = apiKey ? { "x-api-key": apiKey } : {};
  const res = await fetch(url, { headers });
  return res.ok ? res.json() : null;
}
