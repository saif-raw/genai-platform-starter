import { DEPARTMENTS, PROJECTS } from "../config/org";

export default function OrgSelector({
  department,
  project,
  setDepartment,
  setProject
}) {
  return (
    <div className="flex gap-3">
      <select
        className="border rounded-md px-2 py-1 text-sm"
        value={department}
        onChange={e => {
          setDepartment(e.target.value);
          setProject("");
        }}
      >
        <option value="">Department</option>
        {DEPARTMENTS.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        className="border rounded-md px-2 py-1 text-sm"
        value={project}
        disabled={!department}
        onChange={e => setProject(e.target.value)}
      >
        <option value="">Project</option>
        {(PROJECTS[department] || []).map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
}
