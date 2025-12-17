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
  const apiBase = import.meta.env.VITE_API_BASE || "https://oog4ijyedb.execute-api.us-east-1.amazonaws.com/prod";
  const [provider, setProvider] = useState("groq");
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
      const entry = await callGenerate({
        prompt,
        provider: p,
        model: m,
        userId,
        projectId
      });

      setSessions(s => [entry, ...s].slice(0, 500));
      setSelected(entry);
    } catch (err) {
      console.error("Send failed:", err);
      alert(err.message || "Request failed");
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
