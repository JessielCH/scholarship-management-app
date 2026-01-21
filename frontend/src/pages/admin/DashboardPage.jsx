import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { PhaseBanner } from "../../components/ui/PhaseBanner";
import {
  uploadGradesService,
  runSelectionService,
  fetchApplications,
  fetchPeriods, // <--- Nueva función
} from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import {
  Users,
  DollarSign,
  Activity,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Upload,
  Zap,
  Calendar,
} from "lucide-react";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [periods, setPeriods] = useState([]); // Lista de semestres
  const [selectedPeriod, setSelectedPeriod] = useState(null); // Semestre actual seleccionado
  const [uploadedInSession, setUploadedInSession] = useState(false); // CANDADO DEL BOTÓN

  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

  // --- CARGA INICIAL ---
  useEffect(() => {
    initView();
  }, []);

  // Al cambiar el periodo en el dropdown, recargamos la tabla
  useEffect(() => {
    if (selectedPeriod) {
      loadDashboardData(selectedPeriod);
    }
  }, [selectedPeriod]);

  const initView = async () => {
    // 1. Cargar Periodos
    try {
      const periodsData = await fetchPeriods();
      setPeriods(periodsData);

      // Seleccionar el activo por defecto, o el primero de la lista
      const active = periodsData.find((p) => p.is_active) || periodsData[0];
      if (active) {
        setSelectedPeriod(active.id); // Esto disparará el useEffect de arriba
      }
    } catch (e) {
      console.error("Error cargando periodos", e);
    }
  };

  const loadDashboardData = async (periodId) => {
    try {
      // Pasamos el periodId para filtrar
      const data = await fetchApplications(periodId);
      if (data) {
        setApplications(data);
        // Recalcular stats...
        setStats({
          total: data.length,
          pending: data.filter((app) =>
            ["Preselected", "DocumentsPending"].includes(app.status),
          ).length,
          approved: data.filter((app) => app.status === "Approved").length,
        });
      }
    } catch (error) {
      toast.error("Error cargando datos");
    }
  };

  // --- ACCIONES ---

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const toastId = toast.loading("Subiendo notas...");

    try {
      await uploadGradesService(file);
      toast.success("Notas cargadas correctamente", { id: toastId });

      // ¡AQUÍ ESTÁ LA CLAVE DE UX!
      // Solo cuando sube el archivo con éxito, desbloqueamos el botón
      setUploadedInSession(true);
    } catch (error) {
      toast.error("Error al subir archivo", { id: toastId });
      setUploadedInSession(false);
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  const handleRunAlgorithm = async () => {
    if (!confirm("¿Generar lista de becarios para este periodo?")) return;

    setLoading(true);
    const toastId = toast.loading("Calculando el 10%...");

    try {
      const result = await runSelectionService();
      toast.success(`¡Éxito! ${result.total_preselected} nuevos becarios.`, {
        id: toastId,
      });
      loadDashboardData(selectedPeriod); // Refrescar tabla
      setUploadedInSession(false); // Volver a bloquear (opcional, por seguridad)
    } catch (error) {
      toast.error("Error en el cálculo", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* 1. HEADER CON SELECTOR DE PERIODO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Hola, {user?.name?.split(" ")[0] || "Admin"} 👋
          </h1>
          <p className="text-gray-500 mt-1">Gestión de Becas UCE</p>
        </div>

        {/* SELECTOR DE PERIODO (UI NUEVA) */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="p-2 bg-gray-100 rounded-md text-gray-500">
            <Calendar size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase">
              Periodo Académico
            </span>
            <select
              className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer"
              value={selectedPeriod || ""}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.is_active ? "(ACTIVO)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <PhaseBanner mode="admin" />

      {/* 2. BOTONES DE ACCIÓN (CON CANDADO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subir Notas */}
        <label
          className={`
          flex items-center justify-between p-4 bg-white border border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors group
          ${loading ? "opacity-50 pointer-events-none" : ""}
        `}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Upload size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-700 text-sm">
                1. Cargar CSV de Notas
              </p>
              <p className="text-xs text-gray-400">
                Importar promedios del periodo
              </p>
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            accept=".csv,.xlsx"
            onChange={handleFileUpload}
          />
        </label>

        {/* Ejecutar Algoritmo (BLOQUEADO SI NO HAY UPLOAD) */}
        <button
          onClick={handleRunAlgorithm}
          disabled={!uploadedInSession || loading}
          className={`
            flex items-center justify-between p-4 border border-dashed rounded-xl transition-colors text-left
            ${
              uploadedInSession
                ? "bg-white border-purple-300 cursor-pointer hover:bg-purple-50 group"
                : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
            }
        `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg transition-colors ${uploadedInSession ? "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white" : "bg-gray-200 text-gray-400"}`}
            >
              <Zap size={20} />
            </div>
            <div>
              <p
                className={`font-bold text-sm ${uploadedInSession ? "text-gray-700" : "text-gray-400"}`}
              >
                2. Ejecutar Selección Automática
              </p>
              <p className="text-xs text-gray-400">
                {uploadedInSession
                  ? "Listo para calcular Top 10%"
                  : "⚠️ Primero sube las notas"}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* 3. TABLA Y STATS (Se mantienen igual, pero usan 'applications' filtrado) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase">
            Becarios en este periodo
          </p>
          <h3 className="text-3xl font-bold text-gray-800">{stats.total}</h3>
        </div>
        {/* ... resto de cards ... */}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Resultados del Periodo Seleccionado
        </h3>
        {/* ... TU TABLA DE SIEMPRE ... */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-gray-400 uppercase border-b border-gray-100">
                <th className="pb-3 pl-2">Estudiante</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-2 font-bold text-gray-700">
                    {app.student?.first_name} {app.student?.last_name}
                    <div className="text-xs text-gray-400 font-normal">
                      {app.student?.careers?.name}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-500">
                    {/* Aquí podrías mostrar la nota si la trajéramos en el join, por ahora mostramos monto */}
                    ${app.amount}
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-400">
                    No hay datos en este periodo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
