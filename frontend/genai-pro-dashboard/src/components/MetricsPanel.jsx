// src/components/MetricsPanel.jsx
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

export default function MetricsPanel({ sessions }) {
  const metrics = useMemo(() => {
    const totalCalls = sessions.length;

    const totalTokens = sessions.reduce(
      (sum, s) => sum + (s.usage?.totalTokens || 0),
      0
    );

    const avgTokens = totalCalls
      ? Math.round(totalTokens / totalCalls)
      : 0;

    const providers = sessions.reduce((acc, s) => {
      const p = s.result?.provider || "unknown";
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});

    return { totalCalls, totalTokens, avgTokens, providers };
  }, [sessions]);

  const providerLabels = Object.keys(metrics.providers);
  const providerCounts = providerLabels.map(p => metrics.providers[p]);

  const tokensOverTime = {
    labels: sessions.map(s =>
      new Date(s.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Tokens per call",
        data: sessions.map(s => s.usage?.totalTokens || 0),
        tension: 0.3
      }
    ]
  };

  return (
    <div className="bg-white border rounded-md p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Metric label="Total Calls" value={metrics.totalCalls} />
        <Metric label="Total Tokens" value={metrics.totalTokens} />
        <Metric label="Avg Tokens / Call" value={metrics.avgTokens} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border rounded-md">
          <div className="text-sm font-medium mb-2">Provider usage</div>
          {providerLabels.length ? (
            <Bar
              data={{
                labels: providerLabels,
                datasets: [{ label: "Calls", data: providerCounts }]
              }}
            />
          ) : (
            <div className="text-slate-500">No provider data</div>
          )}
        </div>

        <div className="p-3 border rounded-md">
          <div className="text-sm font-medium mb-2">Tokens over time</div>
          {sessions.length ? (
            <Line data={tokensOverTime} />
          ) : (
            <div className="text-slate-500">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="p-3 bg-slate-50 rounded-md">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
