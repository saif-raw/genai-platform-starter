import React from "react";

export default function Header({ apiBase }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold">G</div>
          <div>
            <div className="text-lg font-semibold">GenAI Pro Dashboard</div>
            <div className="text-xs text-slate-500">{apiBase}</div>
          </div>
        </div>
        <div className="text-sm text-slate-600">Status: <span className="font-medium text-slate-800 ml-2">Connected</span></div>
      </div>
    </header>
  );
}
// src/components/Header.jsx