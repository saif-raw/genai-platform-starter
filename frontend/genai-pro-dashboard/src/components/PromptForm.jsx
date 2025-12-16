// frontend/genai-pro-dashborad/src/components/PromptForm.jsx
import React, { useState } from "react";

export default function PromptForm({ onSend, provider, model }) {
  const [prompt, setPrompt] = useState("");
  const [userId, setUserId] = useState("saif");
  const [projectId, setProjectId] = useState("dashboard");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await onSend({ prompt, provider, model, userId, projectId });
    setPrompt("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows="6" placeholder="Enter prompt here..." className="w-full p-3 border rounded-md bg-white" />
      <div className="flex gap-2">
        <input value={userId} onChange={e=>setUserId(e.target.value)} className="px-3 py-2 border rounded-md bg-white" placeholder="userId" />
        <input value={projectId} onChange={e=>setProjectId(e.target.value)} className="px-3 py-2 border rounded-md bg-white" placeholder="projectId" />
        <button type="submit" className="ml-auto bg-brand text-white px-4 py-2 rounded-md font-semibold">Send</button>
      </div>
    </form>
  );
}
