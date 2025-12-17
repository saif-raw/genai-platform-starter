// src/components/ResultsPanel.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ResultsPanel({ lastResponse }) {
  if (!lastResponse) {
    return (
      <div className="p-4 text-slate-600">
        No responses yet — send your first prompt.
      </div>
    );
  }

  const { result, usage, timestamp } = lastResponse;

  return (
    <div className="space-y-4 p-4 bg-white border rounded-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Provider / Model</div>
          <div className="font-semibold">
            {result.provider} / {result.model}
          </div>
        </div>

        <div className="text-right text-xs text-slate-500">
          <div>{new Date(timestamp).toLocaleString()}</div>
          <div>
            Tokens:{" "}
            <span className="font-medium">
              {usage.totalTokens ?? "-"}
            </span>
          </div>
        </div>
      </div>

      {/* LLM Output (Markdown-rendered) */}
      <div className="prose prose-slate max-w-none bg-slate-50 p-4 rounded-md">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {result.text}
        </ReactMarkdown>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
        <div>Input: {usage.inputTokens ?? 0}</div>
        <div>Output: {usage.outputTokens ?? 0}</div>
        <div>Latency: {usage.latencyMs ?? "-"} ms</div>
      </div>
    </div>
  );
}
