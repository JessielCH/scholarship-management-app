import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Home, AlertTriangle } from "lucide-react";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const goBack = () => {
    if (!user) return navigate("/");
    // Regresa a la zona segura según el rol
    if (user.role === "admin") return navigate("/dashboard");
    return navigate("/tracker");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center animate-fade-in">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
        <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <AlertTriangle size={48} className="text-orange-500" />
        </div>

        <h1 className="text-5xl font-black text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-600 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Oops! It seems you've ventured into uncharted territory. This page
          doesn't exist or you don't have access.
        </p>

        <button
          onClick={goBack}
          className="w-full bg-uce-blue text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transform active:scale-95"
        >
          <Home size={20} /> Return to Safety
        </button>
      </div>

      <p className="mt-8 text-xs text-gray-400 font-mono">
        UCE Scholarship System v1.0
      </p>
    </div>
  );
};
