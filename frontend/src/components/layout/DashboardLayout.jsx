import { useState } from "react"; // Ya no necesitamos useEffect para esto
import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  LogOut,
  User,
  Clock,
  RefreshCcw,
} from "lucide-react";
import { auth } from "../../config/firebase";
import { useAuthStore } from "../../store/authStore"; // <--- IMPORTAMOS ZUZTAK

const DashboardLayout = () => {
  const navigate = useNavigate();

  // 1. CONECTAMOS CON ZUSTAND (ZUZTAK)
  // Sacamos el usuario actual y la función de salir
  const user = useAuthStore((state) => state.user);
  const logoutZustand = useAuthStore((state) => state.logout);

  // Estado local solo para la demo de roles
  const [userRole, setUserRole] = useState(user?.role || "ADMIN");

  // --- MENU ITEMS ---
  const adminItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <FileText size={20} />,
      label: "All Contracts",
      path: "/contracts",
    },
    {
      icon: <CheckCircle size={20} />,
      label: "Validation",
      path: "/validation",
    },
  ];

  const studentItems = [
    { icon: <Clock size={20} />, label: "My Timeline", path: "/tracker" },
    { icon: <User size={20} />, label: "My Profile", path: "/profile" },
  ];

  const menuItems = userRole === "ADMIN" ? adminItems : studentItems;

  // Lógica de Logout actualizada
  const handleLogout = async () => {
    await auth.signOut(); // Cierra en Firebase
    logoutZustand(); // Cierra en Zustand (Limpia datos)
    navigate("/"); // Manda al Login
  };

  const toggleRole = () => {
    const newRole = userRole === "ADMIN" ? "STUDENT" : "ADMIN";
    setUserRole(newRole);
    navigate(newRole === "ADMIN" ? "/dashboard" : "/tracker");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm fixed h-full z-10 transition-all">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-uce-blue">
            Scholarship<span className="text-uce-gold">.</span>
          </h2>
          <div className="mt-2 px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500 inline-block">
            {userRole} PORTAL
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-uce-blue rounded-xl transition-all font-medium group"
            >
              <span className="group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer & Profile */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          <button
            onClick={toggleRole}
            className="w-full flex items-center justify-center gap-2 bg-uce-gold/10 text-uce-blue hover:bg-uce-gold/20 py-2 rounded-lg text-xs font-bold transition-colors border border-uce-gold/20"
          >
            <RefreshCcw size={14} /> Switch View (Demo)
          </button>

          {/* PERFIL (Datos vienen de Zuztak ahora) */}
          <div className="flex items-center gap-3 px-2">
            {user?.photo ? (
              <img
                src={user.photo}
                alt="Profile"
                referrerPolicy="no-referrer" // Fix foto Google
                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-uce-blue flex items-center justify-center text-white font-bold select-none">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
            )}

            <div className="text-sm overflow-hidden">
              <p
                className="font-bold text-gray-700 truncate w-32"
                title={user?.name}
              >
                {user?.name || "Guest"}
              </p>
              <p
                className="text-xs text-gray-500 truncate w-32"
                title={user?.email}
              >
                {user?.email || "No Email"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto bg-f5f7fa">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
