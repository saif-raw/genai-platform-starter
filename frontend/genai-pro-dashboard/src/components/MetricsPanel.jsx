import React, { useMemo } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, LineElement, PointElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, LineElement, PointElement);

export default function MetricsPanel({ sessions }) {
  // compute metrics
  const totals = useMemo(() => {
    const last24 = sessions.slice(-1000);
    const totalCalls = last24.length;
    const totalTokens = last24.reduce((s, r) => s + (r.usage?.tokens || 0), 0);
    const avgTokens = totalCalls ? Math.round(totalTokens / totalCalls) : 0;
    const providers = last24.reduce((acc, r) => {
      const p = r.result?.provider || "none";
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});
    const perCall = last24.map(r => r.usage?.tokens || 0);
    return { totalCalls, totalTokens, avgTokens, providers, perCall };
  }, [sessions]);

  const providerLabels = Object.keys(totals.providers);
  const providerCounts = providerLabels.map(l => totals.providers[l]);

  const tokensData = {
    labels: sessions.map(s => new Date(s.timestamp).toLocaleTimeString()),
    datasets: [{
      label: 'Tokens per call',
      data: sessions.map(s => s.usage?.tokens || 0),
      tension: 0.3,
      fill: false
    }]
  };

  return (
    <div className="bg-white border rounded-md p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-slate-50 rounded-md">
          <div className="text-xs text-slate-500">Total Calls (session)</div>
          <div className="text-2xl font-semibold">{totals.totalCalls}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-md">
          <div className="text-xs text-slate-500">Total Tokens</div>
          <div className="text-2xl font-semibold">{totals.totalTokens}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-md">
          <div className="text-xs text-slate-500">Avg Tokens / Call</div>
          <div className="text-2xl font-semibold">{totals.avgTokens}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border rounded-md">
          <div className="text-sm font-medium mb-2">Provider usage</div>
          {providerLabels.length ? <Bar data={{
            labels: providerLabels,
            datasets: [{ label: "Calls", data: providerCounts }]
          }} /> : <div className="text-slate-500">No provider data</div>}
        </div>

        <div className="p-3 border rounded-md">
          <div className="text-sm font-medium mb-2">Tokens over time</div>
          {sessions.length ? <Line data={tokensData} /> : <div className="text-slate-500">No data yet</div>}
        </div>
      </div>
    </div>
  );
}
// src/components/MetricsPanel.jsx