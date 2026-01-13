import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";

// Admin Pages
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ValidationPage } from "./pages/admin/ValidationPage";
import { ContractsPage } from "./pages/admin/ContractsPage"; // <--- NUEVA

// Student Pages
import { TrackerPage } from "./pages/student/TrackerPage";
import { ProfilePage } from "./pages/student/ProfilePage"; // <--- NUEVA

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<DashboardLayout />}>
        {/* Admin Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/validation" element={<ValidationPage />} />
        <Route path="/contracts" element={<ContractsPage />} />{" "}
        {/* Ruta Admin */}
        {/* Student Routes */}
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/profile" element={<ProfilePage />} /> {/* Ruta Student */}
      </Route>
    </Routes>
  );
}

export default App;
