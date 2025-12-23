// frontend/genai-pro-dashboard/src/components/Sidebar.jsx
export default function Sidebar({ selected, onSelect }) {
  const items = [
    "Overview",
    "Cost",
    "Usage by Project",
    "Usage by Department",
    "Models",
    "Audit Logs"
  ];

  return (
    <aside className="w-64 border-r bg-white p-4 space-y-2">
      <div className="text-sm font-semibold mb-4">Metrics</div>
      {items.map(item => (
        <div
          key={item}
          onClick={() => onSelect(item)}
          className={`p-2 rounded-md cursor-pointer text-sm
            ${
              selected === item
                ? "bg-slate-100 font-medium"
                : "hover:bg-slate-50"
            }`}
        >
          {item}
        </div>
      ))}
    </aside>
  );
}
