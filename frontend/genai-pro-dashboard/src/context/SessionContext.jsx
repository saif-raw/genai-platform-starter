// frontend/genai-pro-dashboard/src/context/SessionContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { fetchAdminUsage, normalizeAdminUsage } from "../api";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  // 🔁 Load persisted sessions once
  useEffect(() => {
    async function loadSessions() {
      const resp = await fetchAdminUsage(100);
      if (resp?.usage) {
        const normalized = normalizeAdminUsage(resp.usage);
        setSessions(normalized);
      }
    }
    loadSessions();
  }, []);

  function addSession(entry) {
    setSessions(prev => [entry, ...prev].slice(0, 500));
    setSelectedSession(entry);
  }

  return (
    <SessionContext.Provider
      value={{
        sessions,
        selectedSession,
        setSelectedSession,
        addSession
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSessions must be used inside SessionProvider");
  }
  return ctx;
}
