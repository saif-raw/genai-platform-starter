import React from "react";

export default function ProviderSelector({ provider, setProvider, model, setModel }) {
  return (
    <div className="flex gap-3 items-center">
      <select value={provider} onChange={e => setProvider(e.target.value)} className="px-3 py-2 border rounded-md bg-white">
        <option value="fallback">Fallback (Local)</option>
        <option value="openai">OpenAI</option>
        <option value="bedrock">Bedrock</option>
      </select>

      <input value={model} onChange={e => setModel(e.target.value)} placeholder="model (optional)" className="px-3 py-2 border rounded-md bg-white" />
    </div>
  );
}
// src/components/ProviderSelector.jsx