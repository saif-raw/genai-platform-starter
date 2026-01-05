// frontend/genai-pro-dashboard/src/components/MetricsPanel.jsx
import React, { useMemo } from "react";
import { aggregateSessions } from "../utils/metrics";

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

export default function MetricsPanel({ sessions, view }) {
  const basicMetrics = useMemo(() => {
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

  const costMetrics = useMemo(
    () => aggregateSessions(sessions),
    [sessions]
  );

  if (!sessions.length) {
    return <div className="text-slate-500">No data yet</div>;
  }

  /* ---------- OVERVIEW ---------- */
  if (view === "Overview") {
    const providerLabels = Object.keys(basicMetrics.providers);
    const providerCounts = providerLabels.map(
      p => basicMetrics.providers[p]
    );

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
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <Metric label="Total Calls" value={basicMetrics.totalCalls} />
          <Metric label="Total Tokens" value={basicMetrics.totalTokens} />
          <Metric label="Avg Tokens / Call" value={basicMetrics.avgTokens} />
          <Metric
            label="Total Cost (EUR)"
            value={`€ ${costMetrics.totalCost.toFixed(4)}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-md">
            <div className="text-sm font-medium mb-2">
              Provider Usage
            </div>
            <Bar
              data={{
                labels: providerLabels,
                datasets: [
                  { label: "Calls", data: providerCounts }
                ]
              }}
            />
          </div>

          <div className="p-3 border rounded-md">
            <div className="text-sm font-medium mb-2">
              Tokens Over Time
            </div>
            <Line data={tokensOverTime} />
          </div>
        </div>
      </div>
    );
  }

  /* ---------- COST ---------- */
  if (view === "Cost") {
    return renderBar("Cost by Model", costMetrics.byModel);
  }

  if (view === "Usage by Project") {
    return renderBar("Cost by Project", costMetrics.byProject);
  }

  if (view === "Usage by Department") {
    return renderBar("Cost by Department", costMetrics.byDepartment);
  }

  if (view === "Models") {
    return renderBar("Model Usage Cost", costMetrics.byModel);
  }

  if (view === "Audit Logs") {
    return (
      <div className="space-y-2">
        {sessions.map((s, i) => (
          <div
            key={i}
            className="border p-3 rounded-md text-sm"
          >
            <div className="font-medium truncate">
              {s.prompt}
            </div>
            <div className="text-slate-500 truncate">
              {s.result?.text}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {s.result?.model} • {s.usage?.totalTokens} tokens
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function renderBar(title, data) {
  const labels = Object.keys(data || {});
  const values = Object.values(data || {});

  if (!labels.length) {
    return <div className="text-slate-500">No data</div>;
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <Bar
        data={{
          labels,
          datasets: [{ label: title, data: values }]
        }}
      />
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