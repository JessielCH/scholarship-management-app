import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- AGREGA ESTO PARA VERIFICAR ---
console.log("🔍 DEPURACIÓN:");
console.log("URL:", supabaseUrl);
console.log("KEY:", supabaseAnonKey ? "Existe (Oculta)" : "No existe");
// ----------------------------------

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "⚠️ Critical Error: Supabase environment variables are missing. Please check your .env.local file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
