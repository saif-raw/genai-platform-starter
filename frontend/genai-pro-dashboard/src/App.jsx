// frontend/genai-pro-dashboard/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Playground from "./pages/Playground";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Playground />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
