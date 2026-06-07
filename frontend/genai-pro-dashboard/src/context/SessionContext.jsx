// frontend/genai-pro-dashboard/src/context/SessionContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { fetchAdminUsage, normalizeAdminUsage } from "../api";

const SessionContext = createContext(null);

export function SessionProvider({ children, useLocalOnly = true }) {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  // On GitHub Pages, always use localStorage (useLocalOnly is now default true)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSessions(parsed);
      }
    } catch (e) {
      console.error("Failed to load local sessions", e);
    }
  }, []);

  function addSession(entry) {
    setSessions(prev => {
      const updated = [entry, ...prev].slice(0, 500);
      localStorage.setItem("user_sessions", JSON.stringify(updated));
      return updated;
    });
    setSelectedSession(entry);
  }

  return (
    <SessionContext.Provider
      value={{ sessions, selectedSession, setSelectedSession, addSession }}
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
