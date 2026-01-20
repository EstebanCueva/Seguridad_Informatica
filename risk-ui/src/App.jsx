import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Risks from "./pages/Risks";
import Treatments from "./pages/Treatments";
import Reports from "./pages/Reports";


export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/risks" element={<Risks />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
