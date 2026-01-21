import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// --- 1. CONFIGURACIÓN E INICIALIZACIÓN ---

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializamos el cliente de Supabase (Para lecturas directas y rápidas)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Inicializamos Axios (Para peticiones complejas al Backend Python)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- 2. SERVICIOS DEL ADMIN (Backend Python) ---

/**
 * Sube el archivo CSV/Excel de notas al servidor.
 * @param {File} file - El archivo seleccionado por el usuario.
 */
export const uploadGradesService = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Enviamos como Multipart Form Data
  const response = await api.post("/grades/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Ejecuta el algoritmo de selección del 10% superior.
 * El backend detecta automáticamente el periodo activo.
 */
export const runSelectionService = async () => {
  const response = await api.post("/selection/run-process");
  return response.data;
};

// --- 3. CONSULTAS DE DATOS (Supabase Directo) ---

/**
 * Obtiene la lista de todos los periodos académicos.
 * Útil para llenar el Dropdown del Dashboard.
 */
export const fetchPeriods = async () => {
  const { data, error } = await supabase
    .from("academic_periods")
    .select("*")
    .order("start_date", { ascending: false }); // Los más recientes primero

  if (error) throw error;
  return data;
};

/**
 * Obtiene la lista de postulaciones (Becarios).
 * @param {string|null} periodId - (Opcional) ID del periodo para filtrar.
 */
export const fetchApplications = async (periodId = null) => {
  // Construimos la consulta base trayendo datos relacionados (JOINs)
  let query = supabase
    .from("scholarship_applications")
    .select(
      `
            *,
            student:students (
                first_name,
                last_name,
                university_id,
                email_institutional,
                careers ( name )
            )
        `,
    )
    // Ordenamos por los mejores montos o por fecha de creación
    .order("amount", { ascending: false });

  // APLICAR FILTRO: Si recibimos un ID, filtramos por ese periodo.
  if (periodId) {
    query = query.eq("period_id", periodId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error al obtener postulaciones:", error);
    throw error;
  }

  return data;
};

export default api;
