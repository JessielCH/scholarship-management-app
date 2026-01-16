import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { client } from "../config/contentful";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { LogIn, HelpCircle, Megaphone } from "lucide-react";

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [cmsAnnouncement, setCmsAnnouncement] = useState("Loading news...");

  const navigate = useNavigate();
  const loginZustand = useAuthStore((state) => state.login);

  // 1. JAMSTACK: Cargar noticias de Contentful (INTACTO)
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

  // 2. LOGICA DE LOGIN CON GOOGLE + ZUSTAND
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // A. Login con Firebase (Google)
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // const token = await user.getIdToken(); // Token opcional si no lo usas

      // B. ¡AVISAMOS A ZUSTAND!
      loginZustand({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        // 🔴 CAMBIO ÚNICO Y CRUCIAL: 'admin' en minúsculas
        role: "admin",
      });

      // C. REDIRECCIÓN AL DASHBOARD
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      {/* Línea decorativa */}
      <div className="absolute top-0 left-0 w-full h-2 bg-uce-gold"></div>

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 space-y-8 relative z-10">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-uce-blue">
            Scholarship <br /> Management
          </h1>
          <p className="text-gray-400 text-sm">
            Universidad Central del Ecuador
          </p>
        </div>

        {/* Zona Jamstack (Noticias) */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
          <Megaphone className="text-uce-blue w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-uce-blue">
            <span className="font-bold block text-xs uppercase tracking-wider mb-1">
              Official News (CMS):
            </span>
            {cmsAnnouncement}
          </div>
        </div>

        {/* Botón de Google */}
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
          Sign in with Google
        </Button>

        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Formulario Visual (Estético) */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input
            label="Institutional Email"
            type="email"
            placeholder="user@uce.edu.ec"
          />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Button type="submit" variant="primary" className="w-full">
            <LogIn size={20} className="mr-2 inline" /> Log In
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
