// src/components/SessionLog.jsx
import React from "react";

export default function SessionLog({ sessions, onSelect }) {
  return (
    <div className="bg-white border rounded-md p-3 space-y-2 max-h-[420px] overflow-auto">
      <div className="text-sm font-semibold mb-2">Chat History</div>

      {sessions.length === 0 && (
        <div className="text-slate-500">No history yet.</div>
      )}

      {sessions.map((s, idx) => (
        <div
          key={idx}
          onClick={() => onSelect(s)}
          className="p-2 border rounded-md hover:bg-slate-50 cursor-pointer"
        >
          <div className="text-xs text-slate-500">
            {new Date(s.timestamp).toLocaleString()}
          </div>

          <div className="text-sm font-medium line-clamp-2">
            {s.prompt?.slice(0, 60) || "—"}
          </div>

          <div className="text-xs text-slate-600 line-clamp-1">
            {s.result?.text?.slice(0, 80) || "—"}
          </div>

          <div className="text-xs text-slate-400">
            {s.result?.provider} • {s.usage?.totalTokens ?? 0} tokens
          </div>
        </div>
      ))}
    </div>
  );
}
