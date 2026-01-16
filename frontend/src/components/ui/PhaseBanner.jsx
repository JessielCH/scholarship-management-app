import { useState, useEffect } from "react";
import { client } from "../../config/contentful";
import { Calendar, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const PhaseBanner = ({ mode = "default" }) => {
  const [phaseData, setPhaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhase = async () => {
      try {
        // Buscamos la entrada marcada como 'isActive: true'
        const response = await client.getEntries({
          content_type: "scholarshipPhase", // Asegúrate que este ID coincida con Contentful
          "fields.isActive": true,
          limit: 1,
        });

        if (response.items.length > 0) {
          setPhaseData(response.items[0].fields);
        }
      } catch (error) {
        console.error("CMS Error:", error);
        // Fallback silencioso o toast si eres admin
        if (mode === "admin")
          toast.error("Error connecting to CMS (Contentful)");
      } finally {
        setLoading(false);
      }
    };

    fetchPhase();
  }, [mode]);

  if (loading)
    return (
      <div className="h-16 bg-gray-100 rounded-xl animate-pulse w-full"></div>
    );

  if (!phaseData) return null; // Si no hay fase activa, no mostramos nada

  // Cálculos de fechas
  const start = new Date(phaseData.startDate).toLocaleDateString();
  const end = new Date(phaseData.endDate).toLocaleDateString();
  const today = new Date();
  const deadline = new Date(phaseData.endDate);
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  // Estilos según rol (Admin ve algo más técnico, Estudiante algo más visual)
  const isUrgent = daysLeft <= 3 && daysLeft >= 0;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-6 mb-8 ${
        isUrgent
          ? "bg-orange-50 border-orange-200"
          : "bg-indigo-50 border-indigo-200"
      }`}
    >
      {/* Elemento Decorativo de Fondo */}
      <div
        className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full opacity-20 ${
          isUrgent ? "bg-orange-500" : "bg-indigo-500"
        }`}
      ></div>

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
        {/* IZQUIERDA: Información de la Fase */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg ${
              isUrgent
                ? "bg-orange-100 text-orange-600"
                : "bg-white text-indigo-600"
            }`}
          >
            <Calendar size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                  isUrgent
                    ? "bg-orange-200 text-orange-800"
                    : "bg-indigo-200 text-indigo-800"
                }`}
              >
                Current Phase {phaseData.phaseNumber}
              </span>
              {isUrgent && (
                <span className="text-xs font-bold text-red-500 flex items-center gap-1 animate-pulse">
                  <AlertCircle size={12} /> Closing Soon
                </span>
              )}
            </div>
            <h2
              className={`text-xl font-bold ${
                isUrgent ? "text-orange-900" : "text-indigo-900"
              }`}
            >
              {phaseData.title}
            </h2>
            <p
              className={`text-sm mt-1 max-w-xl ${
                isUrgent ? "text-orange-700" : "text-indigo-700"
              }`}
            >
              {phaseData.description}
            </p>
          </div>
        </div>

        {/* DERECHA: Fechas y Contador */}
        <div className="text-right bg-white/60 p-3 rounded-lg backdrop-blur-sm border border-white/50 min-w-[180px]">
          <p className="text-xs text-gray-500 font-bold uppercase mb-1">
            Timeline
          </p>
          <div className="text-sm font-medium text-gray-700">
            {start} — <span className="text-indigo-600 font-bold">{end}</span>
          </div>
          <div
            className={`mt-2 text-xs font-bold text-center py-1 rounded ${
              daysLeft < 0
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {daysLeft < 0 ? "Phase Closed" : `${daysLeft} days remaining`}
          </div>
        </div>
      </div>
    </div>
  );
};
