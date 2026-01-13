import { useState, useEffect } from "react";
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

const DashboardLayout = () => {
  const navigate = useNavigate();

  // STATE: User Data & Role
  const [currentUser, setCurrentUser] = useState({
    name: "Guest",
    email: "...",
    photo: null,
  });
  const [userRole, setUserRole] = useState("ADMIN"); // 'ADMIN' or 'STUDENT'

  // EFFECT: Load User from LocalStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // --- MENU ITEMS CONFIGURATION ---
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

  // Dynamic Menu Selection
  const menuItems = userRole === "ADMIN" ? adminItems : studentItems;

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("currentUser"); // Clear session
    navigate("/");
  };

  // DEMO FUNCTION: Toggle Role
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
          {/* Demo Toggle Button */}
          <button
            onClick={toggleRole}
            className="w-full flex items-center justify-center gap-2 bg-uce-gold/10 text-uce-blue hover:bg-uce-gold/20 py-2 rounded-lg text-xs font-bold transition-colors border border-uce-gold/20"
          >
            <RefreshCcw size={14} /> Switch View (Demo)
          </button>

          {/* REAL USER PROFILE */}
          <div className="flex items-center gap-3 px-2">
            {currentUser.photo ? (
              <img
                src={currentUser.photo}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-gray-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-uce-blue flex items-center justify-center text-white font-bold">
                {currentUser.name[0]}
              </div>
            )}

            <div className="text-sm overflow-hidden">
              <p
                className="font-bold text-gray-700 truncate w-32"
                title={currentUser.name}
              >
                {currentUser.name}
              </p>
              <p
                className="text-xs text-gray-500 truncate w-32"
                title={currentUser.email}
              >
                {currentUser.email}
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

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto bg-f5f7fa">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
