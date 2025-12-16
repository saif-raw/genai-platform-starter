// frontend/genai-pro-dashboard/src/components/ProviderSelector.jsx
import React from "react";

export default function ProviderSelector({ provider, setProvider, model, setModel }) {
  return (
    <div className="flex gap-3 items-center">
      <select
        value={provider}
        onChange={e => setProvider(e.target.value)}
        className="px-3 py-2 border rounded-md bg-white"
      >
        <option value="groq">Groq</option>
      </select>

      <input
        value={model}
        onChange={e => setModel(e.target.value)}
        placeholder="openai/gpt-oss-20b"
        className="px-3 py-2 border rounded-md bg-white"
      />
    </div>
  );
}
