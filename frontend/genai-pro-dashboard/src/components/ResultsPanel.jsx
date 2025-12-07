import React from "react";

export default function ResultsPanel({ lastResponse }) {
  if (!lastResponse) {
    return <div className="p-4 text-slate-600">No responses yet — send your first prompt.</div>;
  }

  const { result, usage, message, timestamp } = lastResponse;

  return (
    <div className="space-y-3 p-4 bg-white border rounded-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Routed</div>
          <div className="font-semibold">{result.provider} / {result.model}</div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>{new Date(timestamp).toLocaleString()}</div>
          <div>Tokens: <span className="font-medium">{usage?.tokens ?? "-"}</span></div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 rounded-md code">{result.text}</div>

      <div className="text-xs text-slate-500">
        <div>Message: {message}</div>
        <div>Prompt snippet: {usage?.prompt_snippet}</div>
      </div>
    </div>
  );
}
// src/components/ResultsPanel.jsx