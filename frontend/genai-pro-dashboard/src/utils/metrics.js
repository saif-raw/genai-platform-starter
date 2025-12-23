// frontend/genai-pro-dashboard/src/utils/metrics.js
import { calculateCost } from "../config/pricing";

export function aggregateSessions(sessions) {
  const byModel = {};
  const byProject = {};
  const byDepartment = {};
  let totalCost = 0;

  for (const s of sessions) {
    const model = s.result?.model;
    const project = s.projectId || "unknown";
    const department = s.userId || "unknown";

    const cost = calculateCost({
      model,
      inputTokens: s.usage?.inputTokens,
      outputTokens: s.usage?.outputTokens
    });

    totalCost += cost;

    byModel[model] = (byModel[model] || 0) + cost;
    byProject[project] = (byProject[project] || 0) + cost;
    byDepartment[department] = (byDepartment[department] || 0) + cost;
  }

  return {
    totalCost,
    byModel,
    byProject,
    byDepartment
  };
}
