import { useState } from "react";
import { PhaseBanner } from "../../components/ui/PhaseBanner";
import { useAuthStore } from "../../store/authStore";
import {
  CheckCircle,
  UploadCloud,
  FileText,
  Download,
  Bell,
  AlertTriangle,
  FileDown, // Nuevo icono para bajar contrato
  Printer,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export const TrackerPage = () => {
  const user = useAuthStore((state) => state.user);

  const steps = [
    { num: 1, label: "Registration" },
    { num: 2, label: "Docs Upload" },
    { num: 3, label: "Validation" },
    { num: 4, label: "Assignment" },
    { num: 5, label: "Contract" },
    { num: 6, label: "Disbursement" },
  ];

  // Simulamos que estamos en el Paso 5 (Firmar Contrato) para ver el botón
  const currentStep = 5;

  const notifications = [
    {
      id: 1,
      type: "info",
      msg: "Scholarship assigned! Please sign your contract.",
      date: "Today",
    },
  ];

  const myDocuments = [
    { id: 1, name: "Citizenship ID", status: "Approved", file: "cedula.pdf" },
    { id: 2, name: "Bank Certificate", status: "Approved", file: "banco.pdf" },
    // El contrato está pendiente de SUBIDA, pero primero hay que BAJARLO
    {
      id: 3,
      name: "Scholarship Contract",
      status: "Pending",
      file: null,
      isContract: true,
    },
  ];

  const handleUpload = (docName) => {
    toast.success(`Uploading ${docName}...`);
    setTimeout(() => toast.success("File uploaded successfully!"), 1500);
  };

  // --- NUEVA FUNCIÓN: DESCARGAR CONTRATO GENERADO ---
  const handleDownloadContract = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: "Generating PDF with your data (Name, ID, Bank Account)...",
      success: "Contract downloaded! Please sign and re-upload.",
      error: "Error generating contract",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Tracker</h1>
          <p className="text-gray-500">
            Welcome, {user?.name || "Student"}. Manage your scholarship
            application.
          </p>
        </div>
      </div>

      <PhaseBanner mode="student" />

      {/* ROADMAP HORIZONTAL */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
          Process Timeline
        </h3>
        <div className="flex items-center justify-between min-w-[700px] relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-uce-blue -z-0 transition-all duration-1000"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          ></div>

          {steps.map((step) => (
            <div
              key={step.num}
              className="relative z-10 flex flex-col items-center group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 font-bold text-sm transition-all ${
                  step.num < currentStep
                    ? "bg-uce-blue border-uce-blue text-white"
                    : step.num === currentStep
                    ? "bg-white border-uce-blue text-uce-blue scale-125 shadow-lg"
                    : "bg-white border-gray-200 text-gray-300"
                }`}
              >
                {step.num < currentStep ? <CheckCircle size={16} /> : step.num}
              </div>
              <span
                className={`mt-3 text-xs font-bold ${
                  step.num === currentStep ? "text-uce-blue" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* NOTIFICACIONES */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
              <Bell className="text-uce-gold" size={20} /> Notifications
            </h3>
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border text-sm ${
                    notif.type === "warning"
                      ? "bg-orange-50 border-orange-100 text-orange-800"
                      : "bg-blue-50 border-blue-100 text-blue-800"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 opacity-60 text-xs">
                    <span className="font-bold uppercase">{notif.type}</span>
                    <span>{notif.date}</span>
                  </div>
                  <p>{notif.msg}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GESTOR DE DOCUMENTOS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FileText className="text-uce-blue" size={20} /> My Documents
              </h3>
            </div>

            <div className="space-y-3">
              {myDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors gap-4"
                >
                  {/* Info del Documento */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        doc.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-700">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                            doc.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : doc.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* BOTÓN ESPECIAL: DESCARGAR CONTRATO GENERADO */}
                    {doc.isContract && doc.status !== "Approved" && (
                      <button
                        onClick={handleDownloadContract}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-uce-blue text-uce-blue px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors"
                        title="Download legal contract with your data"
                      >
                        <Printer size={14} /> Generate & Download
                      </button>
                    )}

                    {/* BOTÓN: SUBIR ARCHIVO */}
                    {doc.status !== "Approved" && (
                      <button
                        onClick={() => handleUpload(doc.name)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-uce-blue text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors shadow-sm"
                      >
                        <UploadCloud size={14} /> Upload Signed
                      </button>
                    )}

                    {/* YA APROBADO */}
                    {doc.status === "Approved" && (
                      <div className="text-green-500 p-2">
                        <CheckCircle size={24} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
