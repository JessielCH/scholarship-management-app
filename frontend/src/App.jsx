import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute"; // <--- IMPORTA EL GUARDIA

// Admin Pages
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ValidationPage } from "./pages/admin/ValidationPage";
import { ContractsPage } from "./pages/admin/ContractsPage";

// Student Pages
import { TrackerPage } from "./pages/student/TrackerPage";
import { ProfilePage } from "./pages/student/ProfilePage";

function App() {
  return (
    <Routes>
      {/* RUTA PÚBLICA (Cualquiera entra) */}
      <Route path="/" element={<LoginPage />} />

      {/* RUTAS PROTEGIDAS (Solo con Login) */}
      <Route element={<ProtectedRoute />}>
        {" "}
        {/* <--- EL GUARDIA VIGILA AQUÍ */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
