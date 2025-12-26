// frontend/genai-pro-dashboard/src/pages/Playground.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import ProviderSelector from "../components/ProviderSelector";
import PromptForm from "../components/PromptForm";
import ResultsPanel from "../components/ResultsPanel";
import SessionLog from "../components/SessionLog";
import OrgSelector from "../components/OrgSelector";
import { callGenerate } from "../api";
import { SessionProvider, useSessions } from "../context/SessionContext";

function PlaygroundInner() {
  const apiBase = import.meta.env.VITE_API_BASE;

  const { sessions, selectedSession, setSelectedSession, addSession } =
    useSessions();

  const [provider, setProvider] = useState("groq");
  const [model, setModel] = useState("");
  const [department, setDepartment] = useState("");
  const [project, setProject] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSend({ prompt }) {
    if (!department || !project) {
      alert("Please select department and project");
      return;
    }

    setLoading(true);
    try {
      const entry = await callGenerate({
        prompt,
        provider,
        model,
        userId: department,
        projectId: project
      });
      addSession(entry);
    } catch (e) {
      alert(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header apiBase={apiBase} showAdminLink />

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-3 gap-6">
        <section className="col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-md border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Playground</h2>
              <div className="flex gap-4">
                <OrgSelector
                  department={department}
                  project={project}
                  setDepartment={setDepartment}
                  setProject={setProject}
                />
                <ProviderSelector
                  provider={provider}
                  setProvider={setProvider}
                  model={model}
                  setModel={setModel}
                />
              </div>
            </div>

            <PromptForm
              onSend={onSend}
              provider={provider}
              model={model}
              loading={loading}
            />
          </div>

          <ResultsPanel lastResponse={selectedSession} />
        </section>

        <aside>
          <SessionLog sessions={sessions} onSelect={setSelectedSession} />
        </aside>
      </main>
    </div>
  );
}

export default function Playground() {
  return (
    <SessionProvider useLocalOnly={true}>
      <PlaygroundInner />
    </SessionProvider>
  );
}
