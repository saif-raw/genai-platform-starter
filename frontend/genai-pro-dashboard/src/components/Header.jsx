// frontend/genai-pro-dashboard/src/components/Header.jsx
import { Link } from "react-router-dom";

export default function Header({ showAdminLink = false }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white font-bold">
            G
          </div>
          <div>
            <div className="text-lg font-semibold">Gen AI - Pro Dashboard</div>
            <div className="text-xs text-slate-500">Running on GitHub Pages + Groq API</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {showAdminLink && (
            <Link
              to="/admin"
              className="font-medium text-slate-700 hover:underline"
            >
              {/* Dashboard */}
            </Link>
          )}
          <span className="text-slate-600">
            Status:{" "}
            <span className="font-medium text-slate-800">Connected</span>
          </span>
        </div>
      </div>
    </header>
  );
}
