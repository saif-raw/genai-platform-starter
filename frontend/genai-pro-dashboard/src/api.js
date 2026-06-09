// frontend/genai-pro-dashboard/src/api.js
// Direct Groq API calls + Optional standalone backend support
// Works on GitHub Pages (localStorage) or with standalone Node.js backend

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_BASE = "https://api.groq.com/openai/v1";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || null; // Optional backend

/* ========================================
   DIRECT GROQ API CALLS (NO AWS BACKEND)
   ======================================== */

export async function callGenerate({
  prompt,
  provider = "groq",
  model,
  userId = "local-user",
  projectId = "dashboard"
}) {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured. Check your environment variables.");
  }

  if (provider !== "groq") {
    throw new Error(`Provider "${provider}" is not supported. Only Groq is available on GitHub Pages.`);
  }

  if (!model) {
    throw new Error("Model is required");
  }

  const startTime = performance.now();

  try {
    const res = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const json = await res.json();
    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    if (!res.ok) {
      throw new Error(json?.error?.message || `API Error: ${res.statusText}`);
    }

    const responseText = json.choices?.[0]?.message?.content || "";
    const usage = json.usage || {};

    // Create session entry with usage data
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      prompt,
      userId,
      projectId,
      result: {
        provider: "groq",
        model,
        text: responseText
      },
      usage: {
        inputTokens: usage.prompt_tokens ?? 0,
        outputTokens: usage.completion_tokens ?? 0,
        totalTokens: usage.total_tokens ?? 0,
        latencyMs
      }
    };

    // Store in localStorage for usage tracking
    storeUsageEntry(entry);

    // Also send to backend if available (optional)
    sendToBackend(entry).catch(err => console.warn("Backend sync failed:", err.message));

    return entry;
  } catch (error) {
    throw new Error(error.message || "Failed to call Groq API");
  }
}

/* ========================================
   LOCAL USAGE STORAGE (CLIENT-SIDE ONLY)
   ======================================== */

export function storeUsageEntry(entry) {
  try {
    const key = "genai_usage_history";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [entry, ...existing].slice(0, 500); // Keep last 500
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not store usage entry:", e);
  }
}

/* ========================================
   OPTIONAL BACKEND SYNC
   ======================================== */

export async function sendToBackend(entry) {
  if (!BACKEND_URL) return; // No backend configured

  try {
    await fetch(`${BACKEND_URL}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: entry.prompt,
        userId: entry.userId,
        projectId: entry.projectId,
        model: entry.result.model,
        provider: entry.result.provider,
        response: entry.result.text,
        latencyMs: entry.usage.latencyMs,
        inputTokens: entry.usage.inputTokens,
        outputTokens: entry.usage.outputTokens,
        totalTokens: entry.usage.totalTokens
      })
    });
  } catch (err) {
    // Silently fail - backend is optional
    throw err;
  }
}

export function getStoredUsage(limit = 100) {
  try {
    const key = "genai_usage_history";
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return data.slice(0, limit);
  } catch (e) {
    console.warn("Could not retrieve usage history:", e);
    return [];
  }
}

export function clearStoredUsage() {
  try {
    localStorage.removeItem("genai_usage_history");
  } catch (e) {
    console.warn("Could not clear usage history:", e);
  }
}

/* ========================================
   COMPATIBILITY FUNCTIONS (FOR DASHBOARD)
   ======================================== */

export async function fetchAdminUsage(lastN = 50, apiKey = null) {
  // Try backend first, fall back to localStorage
  if (BACKEND_URL) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/usage?limit=${lastN}`);
      if (res.ok) {
        const data = await res.json();
        return {
          usage: normalizeAdminUsage(data.recentSessions || []),
          stats: {
            totalRequests: data.totalRequests,
            totalTokensUsed: data.totalTokensUsed,
            avgLatencyMs: data.avgLatencyMs
          }
        };
      }
    } catch (err) {
      console.warn("Backend fetch failed, falling back to localStorage:", err.message);
    }
  }

  // Fallback to localStorage
  const usage = getStoredUsage(lastN);
  return {
    usage: normalizeAdminUsage(usage),
    stats: {
      totalRequests: usage.length,
      totalTokensUsed: usage.reduce((sum, u) => sum + (u.usage?.totalTokens || 0), 0),
      avgLatencyMs: usage.length > 0 
        ? Math.round(usage.reduce((sum, u) => sum + (u.usage?.latencyMs || 0), 0) / usage.length)
        : 0
    }
  };
}

/* -----------------------------
   NORMALIZER (localStorage → UI)
----------------------------- */

export function normalizeAdminUsage(items = []) {
  return items.map(u => ({
    sessionId: u.sessionId || u.id || null,
    timestamp: u.timestamp,
    prompt: u.prompt ?? "[stored session]",
    userId: u.userId ?? "unknown",
    projectId: u.projectId ?? "unknown",
    result: {
      provider: u.result?.provider ?? u.provider ?? "groq",
      model: u.result?.model ?? u.model ?? "unknown",
      text: u.result?.text ?? u.response ?? ""
    },
    usage: {
      inputTokens: u.usage?.inputTokens ?? u.inputTokens ?? 0,
      outputTokens: u.usage?.outputTokens ?? u.outputTokens ?? 0,
      totalTokens: u.usage?.totalTokens ?? u.totalTokens ?? 0,
      latencyMs: u.usage?.latencyMs ?? u.latencyMs ?? 0
    }
  }));
}
