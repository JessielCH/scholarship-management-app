import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";

// Admin Pages
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ValidationPage } from "./pages/admin/ValidationPage";
import { ContractsPage } from "./pages/admin/ContractsPage";
import { SelectionPage } from "./pages/admin/SelectionPage";

// Student Pages
import { TrackerPage } from "./pages/student/TrackerPage";
import { ProfilePage } from "./pages/student/ProfilePage";

// NUEVA PÁGINA
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Admin Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/selection" element={<SelectionPage />} />

          {/* Student Routes */}
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* RUTA COMODÍN (Cualquier cosa que no exista cae aquí) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
