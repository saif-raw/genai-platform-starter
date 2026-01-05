// frontend/genai-pro-dashboard/src/pages/Dashboard.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MetricsPanel from "../components/MetricsPanel";
import SessionLog from "../components/SessionLog";
import { SessionProvider, useSessions } from "../context/SessionContext";

function DashboardInner() {
  const apiBase = import.meta.env.VITE_API_BASE;

  const { sessions } = useSessions();
  const [activeView, setActiveView] = useState("Overview");

  return (
    <div>
      <Header apiBase={apiBase} />

      <div className="flex h-[calc(100vh-72px)]">
        <Sidebar selected={activeView} onSelect={setActiveView} />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          <MetricsPanel sessions={sessions} view={activeView} />

          {activeView === "Overview" && <SessionLog sessions={sessions} />}
        </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <SessionProvider useLocalOnly={false}>
      <DashboardInner />
    </SessionProvider>
  );
}