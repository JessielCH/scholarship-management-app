import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  ShieldCheck,
  Building,
  BadgeCheck,
  GraduationCap,
  Award,
  Activity,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// 1. ESQUEMA DE VALIDACIÓN (ZOD)
const profileSchema = z.object({
  // Campos Editables
  personalEmail: z.string().email("Please enter a valid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Only numbers allowed"),
  address: z.string().min(5, "Address is too short"),

  // Campos Oficiales (Solo Lectura)
  fullName: z.string(),
  studentId: z.string(),
  faculty: z.string(),
  career: z.string(), // <--- NUEVO
  scholarshipType: z.string(), // <--- NUEVO
  scholarshipStatus: z.string(), // <--- NUEVO
});

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  // 2. CONFIGURACIÓN DEL FORMULARIO
  const {
    register,
    handleSubmit,
    watch, // Para leer el estado y cambiar el color
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      // DATOS OFICIALES (MOCK)
      fullName: user?.name || "Jessiel Chasiguano",
      studentId: "1725698741",
      faculty: "Faculty of Engineering",
      career: "Software Engineering", // <--- NUEVO: Carrera
      scholarshipType: "Academic Excellence", // <--- NUEVO: Tipo (Socioeconómica / Excelencia)
      scholarshipStatus: "Active (In Progress)", // <--- NUEVO: Estado (En Curso / Rechazada)

      // DATOS DE CONTACTO
      personalEmail: user?.email || "jessiel@example.com",
      phoneNumber: "0991234567",
      address: "Av. Universitaria y calle A, Quito",
    },
  });

  const currentStatus = watch("scholarshipStatus");

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Updated Data:", data);
    toast.success("Profile updated successfully!", {
      description: "Your contact information has been saved.",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
        <div className="w-16 h-16 rounded-full bg-uce-blue flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
          {user?.name ? user.name.charAt(0) : "J"}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Student Profile
          </h1>
          <p className="text-gray-500 flex items-center gap-2">
            <BadgeCheck size={16} className="text-uce-gold" />
            Verified Student • Semester 2026-I
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* COLUMNA IZQUIERDA: DATOS ACADÉMICOS OFICIALES (4 Columnas) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
              <ShieldCheck size={18} className="text-uce-blue" /> Academic
              Record
            </h3>

            <div className="space-y-4">
              {/* STATUS BADGE GRANDE */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-1 ${
                  currentStatus.includes("Active") ||
                  currentStatus.includes("In Progress")
                    ? "bg-green-100 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <Activity size={24} className="mb-1" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                  Current Status
                </span>
                <span className="text-lg font-bold">{currentStatus}</span>
              </div>

              {/* TIPO DE BECA */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Scholarship Type
                </label>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 text-gray-700 cursor-not-allowed">
                  <Award size={18} className="text-uce-gold" />
                  <input
                    {...register("scholarshipType")}
                    disabled
                    className="bg-transparent w-full font-bold text-sm"
                  />
                </div>
              </div>

              {/* CARRERA (NUEVO) */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Career / Degree
                </label>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 text-gray-700 cursor-not-allowed">
                  <GraduationCap size={18} className="text-gray-400" />
                  <input
                    {...register("career")}
                    disabled
                    className="bg-transparent w-full font-medium text-sm"
                  />
                </div>
              </div>

              {/* FACULTAD */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Faculty
                </label>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed">
                  <Building size={18} className="text-gray-400" />
                  <input
                    {...register("faculty")}
                    disabled
                    className="bg-transparent w-full text-sm"
                  />
                </div>
              </div>

              {/* NOMBRE COMPLETO */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  Full Name
                </label>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed">
                  <User size={18} className="text-gray-400" />
                  <input
                    {...register("fullName")}
                    disabled
                    className="bg-transparent w-full text-sm"
                  />
                </div>
              </div>

              {/* CÉDULA */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                  ID / DNI
                </label>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 text-gray-500 cursor-not-allowed">
                  <BadgeCheck size={18} className="text-gray-400" />
                  <input
                    {...register("studentId")}
                    disabled
                    className="bg-transparent w-full font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: DATOS DE CONTACTO (EDITABLES) (8 Columnas) */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Contact Information
              </h3>
              <span className="text-xs bg-blue-50 text-uce-blue px-3 py-1 rounded-full font-bold">
                Editable
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Personal Email
                </label>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    errors.personalEmail
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 focus-within:border-uce-blue focus-within:ring-4 focus-within:ring-blue-50"
                  }`}
                >
                  <Mail size={20} className="text-gray-400" />
                  <input
                    {...register("personalEmail")}
                    className="w-full bg-transparent focus:outline-none text-gray-800"
                  />
                </div>
                {errors.personalEmail && (
                  <p className="text-xs text-red-500 font-bold ml-1">
                    {errors.personalEmail.message}
                  </p>
                )}
              </div>

              {/* TELÉFONO */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Mobile Phone
                </label>
                <div
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    errors.phoneNumber
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 focus-within:border-uce-blue focus-within:ring-4 focus-within:ring-blue-50"
                  }`}
                >
                  <Phone size={20} className="text-gray-400" />
                  <input
                    {...register("phoneNumber")}
                    className="w-full bg-transparent focus:outline-none text-gray-800"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 font-bold ml-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* DIRECCIÓN */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">
                  Current Address
                </label>
                <div
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    errors.address
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 focus-within:border-uce-blue focus-within:ring-4 focus-within:ring-blue-50"
                  }`}
                >
                  <MapPin size={20} className="text-gray-400 mt-1" />
                  <textarea
                    {...register("address")}
                    rows="4"
                    className="w-full bg-transparent focus:outline-none text-gray-800 resize-none"
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500 font-bold ml-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-uce-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={20} /> Save Updates
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
