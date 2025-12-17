// src/components/ProviderSelector.jsx
import React from "react";
import { GROQ_CHAT_MODELS } from "../config/groqModels";

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

      {provider === "groq" ? (
        <select
          value={model}
          onChange={e => setModel(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white min-w-[260px]"
        >
          {GROQ_CHAT_MODELS.map(m => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          value={model}
          onChange={e => setModel(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white"
        />
      )}
    </div>
  );
}
