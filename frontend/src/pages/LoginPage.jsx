import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 1. SUPABASE & STORES
import { supabase } from "../config/supabaseClient";
import { client } from "../config/contentful";
import { useAuthStore } from "../store/authStore";
// 2. UI COMPONENTS
import { Button } from "../components/ui/Button";
// Nota: Quitamos el import de Input para usar HTML nativo y evitar el error
import { LogIn, HelpCircle, Megaphone, Lock, Mail, User } from "lucide-react";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [cmsAnnouncement, setCmsAnnouncement] = useState("Loading news...");

  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const loginZustand = useAuthStore((state) => state.login);

  // --- JAMSTACK (NOTICIAS) ---
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await client.getEntries({ content_type: "anuncio" });
        if (response.items.length > 0) {
          setCmsAnnouncement(response.items[0].fields.mensaje);
        } else {
          setCmsAnnouncement("No active announcements.");
        }
      } catch (error) {
        console.error("CMS Error:", error);
        setCmsAnnouncement("System Online - Secure Mode");
      }
    };
    fetchAnnouncement();
  }, []);

  // --- DETECTAR ROL ---
  const determineRole = async (email) => {
    // A. Whitelist (Admin)
    const { data: whitelist } = await supabase
      .from("admin_whitelist")
      .select("role")
      .eq("email", email)
      .single();

    if (whitelist) return "admin";

    // B. Perfil (Estudiante)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .single();

    if (profile && profile.role === "student") return "student";

    return "guest";
  };

  // --- LOGIN INSTITUCIONAL (EL QUE DABA ERROR) ---
  const handleInstitutionalLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("📨 Intentando enviar:", formData); // DEPURACIÓN: Verás esto en consola

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Por favor ingresa correo y contraseña");
      }

      // 1. Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: formData.email,
          password: formData.password,
        },
      );

      if (authError) throw authError;

      // 2. Roles
      const email = data.user.email;
      const role = await determineRole(email);

      // 3. Guardar sesión
      loginZustand({
        uid: data.user.id,
        name: email.split("@")[0],
        email: email,
        role: role,
      });

      // 4. Redirigir
      if (role === "admin") navigate("/dashboard");
      else if (role === "student") navigate("/tracker");
      else navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error de Login:", err);
      setError(
        err.message === "Invalid login credentials"
          ? "Credenciales incorrectas"
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN GOOGLE / INVITADO ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      loginZustand({
        uid: "guest-123",
        name: "Invitado Externo",
        email: "guest@gmail.com",
        photo: "https://www.svgrepo.com/show/475656/google-color.svg",
        role: "guest",
      });
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      <div className="absolute top-0 left-0 w-full h-2 bg-uce-gold"></div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 space-y-8 relative z-10">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-uce-blue">
            Scholarship <br /> Management
          </h1>
          <p className="text-gray-400 text-sm">
            Universidad Central del Ecuador
          </p>
        </div>

        {/* NOTICIAS */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
          <Megaphone className="text-uce-blue w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-uce-blue">
            <span className="font-bold block text-xs uppercase tracking-wider mb-1">
              Official News (CMS):
            </span>
            {cmsAnnouncement}
          </div>
        </div>

        {/* BOTÓN GOOGLE */}
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-spin">⌛</span>
          ) : (
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="G"
            />
          )}
          Sign in with Google (Guest)
        </Button>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* --- FORMULARIO CORREGIDO (USANDO INPUTS HTML NATIVOS) --- */}
        <form className="space-y-4" onSubmit={handleInstitutionalLogin}>
          {/* CAMPO EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institutional Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="email"
                placeholder="superadmin@uce.edu.ec"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* CAMPO PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                <LogIn size={20} className="mr-2 inline" /> Log In
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <a
            href="#"
            className="text-gray-500 text-sm hover:text-uce-blue flex items-center justify-center gap-1"
          >
            <HelpCircle size={16} /> Need help?
          </a>
        </div>
      </div>
    </div>
  );
};
