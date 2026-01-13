import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore"; // Importamos Zuztak

export const ProtectedRoute = () => {
  // Preguntamos a Zuztak: "¿Está autenticado?"
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // SI NO ESTÁ AUTENTICADO -> PATEAR AL LOGIN (/)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // SI SÍ ESTÁ -> DEJAR PASAR (Renderizar la página solicitada)
  return <Outlet />;
};
