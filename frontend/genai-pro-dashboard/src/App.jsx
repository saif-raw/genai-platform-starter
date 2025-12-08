// genai-pro-dashborad/src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import ProviderSelector from "./components/ProviderSelector";
import PromptForm from "./components/PromptForm";
import ResultsPanel from "./components/ResultsPanel";
import SessionLog from "./components/SessionLog";
import MetricsPanel from "./components/MetricsPanel";
import { callGenerate, fetchAdminUsage } from "./api";

export default function App() {
  const apiBase = import.meta.env.VITE_API_BASE || "https://oog4ijyedb.execute-api.ap-south-1.amazonaws.com/prod";
  const [provider, setProvider] = useState("fallback");
  const [model, setModel] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminUsage, setAdminUsage] = useState(null);

  useEffect(() => {
    // try to fetch server-side usage if admin endpoint exists
    (async () => {
      try {
        const res = await fetchAdminUsageSafe();
        if (res) setAdminUsage(res);
      } catch { /* ignore */ }
    })();
  }, []);

  async function fetchAdminUsageSafe() {
    try {
      return await fetchAdminUsage(50);
    } catch (e) {
      return null;
    }
  }

  async function onSend({ prompt, provider: p, model: m, userId, projectId }) {
    setLoading(true);
    try {
      const { ok, json } = await callGenerate({ prompt, provider: p, model: m, userId, projectId });
      const entry = {
        timestamp: new Date().toISOString(),
        result: json.result || { provider: "none", model: "none", text: json?.result?.text || json?.message || "" },
        usage: json.usage || { tokens: 0, prompt_snippet: prompt },
        message: json.message || ""
      };
      setSessions(s => [entry, ...s].slice(0, 500));
      setSelected(entry);
    } catch (err) {
      console.error("send error", err);
      alert("Send failed: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header apiBase={apiBase} />
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-3 gap-6">
        <section className="col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-md border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Playground</h2>
              <ProviderSelector provider={provider} setProvider={setProvider} model={model} setModel={setModel} />
            </div>

            <PromptForm onSend={onSend} provider={provider} model={model} />
          </div>

          <div>
            <ResultsPanel lastResponse={selected} />
          </div>
        </section>

        <aside className="space-y-4">
          <div>
            <MetricsPanel sessions={sessions} />
          </div>

          <div>
            <SessionLog sessions={sessions} onSelect={s => setSelected(s)} />
          </div>

        </aside>
      </main>
    </div>
  );
}
