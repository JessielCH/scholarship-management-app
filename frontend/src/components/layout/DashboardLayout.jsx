import { useAuthStore } from "../../store/authStore";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  LogOut,
  BrainCircuit,
  Menu,
  X,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function DashboardLayout() {
  const { logout, login, user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // <--- ESTADO DEL MODAL

  // Menús...
  const adminItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <BrainCircuit size={20} />,
      label: "AI Selection",
      path: "/selection",
    },
    {
      icon: <FileText size={20} />,
      label: "Scholarship Archive",
      path: "/contracts",
    },
    {
      icon: <CheckCircle size={20} />,
      label: "Pending Reviews",
      path: "/validation",
    },
  ];

  const studentItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "My Application",
      path: "/tracker",
    },
    { icon: <FileText size={20} />, label: "My Profile", path: "/profile" },
  ];

  const navItems = user?.role === "admin" ? adminItems : studentItems;

  const handleRoleSwitch = () => {
    const isCurrentlyAdmin = user?.role === "admin";
    const newRole = isCurrentlyAdmin ? "student" : "admin";
    const currentPhoto = user?.photo;

    const newUserData = {
      name: newRole === "admin" ? "Admin User" : "Jessiel Chasiguano",
      email: "test@uce.edu.ec",
      role: newRole,
      photo:
        newRole === "student"
          ? currentPhoto ||
            "https://ui-avatars.com/api/?name=Jessiel+Chasiguano&background=0D8ABC&color=fff"
          : null,
    };

    login(newUserData);

    if (newRole === "admin") navigate("/dashboard");
    else navigate("/tracker");

    setIsMobileMenuOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* MODAL DE CONFIRMACIÓN DE SALIDA (NUEVO) */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <LogOut size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Sign Out?</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">
                Are you sure you want to end your session? You will need to
                login again.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <span className="text-2xl font-bold text-uce-blue">UCE</span>
            <span className="text-2xl font-light text-gray-400 ml-1">
              Becas
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="ml-auto lg:hidden text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-uce-blue text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-600 hover:bg-gray-50 hover:text-uce-blue"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <button
              onClick={handleRoleSwitch}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors text-xs font-bold"
            >
              <RefreshCcw size={14} /> Switch Role
            </button>

            <div className="flex items-center gap-3 px-2 pt-2">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-uce-gold/20 flex items-center justify-center text-uce-gold font-bold">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>

            {/* BOTÓN QUE ABRE EL MODAL */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-bold"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:hidden flex-shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="ml-3 font-bold text-gray-800">UCE Becas</span>
        </header>

        {/* AQUÍ APLICAMOS LA ANIMACIÓN GLOBAL A TODAS LAS PÁGINAS */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
