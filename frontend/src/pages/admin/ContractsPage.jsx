import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Loader2,
  FileCheck,
  FileText,
  Table,
  Printer,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// --- 1. DATOS QUEMADOS (HARDCODED DATA) ---
const MOCK_ARCHIVE_DATA = [
  {
    id: "S001",
    name: "Maria Garcia",
    faculty: "Engineering",
    phase: "5/7",
    status: "Approved",
  },
  {
    id: "S002",
    name: "Juan Perez",
    faculty: "Medicine",
    phase: "3/7",
    status: "Pending",
  },
  {
    id: "S003",
    name: "Ana Lopez",
    faculty: "Arts",
    phase: "6/7",
    status: "Under Review",
  },
  {
    id: "S004",
    name: "Carlos Diaz",
    faculty: "Business",
    phase: "1/7",
    status: "Rejected",
  },
  {
    id: "S005",
    name: "Elena Torres",
    faculty: "Engineering",
    phase: "7/7",
    status: "Paid",
  },
  {
    id: "S006",
    name: "Luis Vega",
    faculty: "Sciences",
    phase: "2/7",
    status: "Pending",
  },
  {
    id: "S007",
    name: "Sofia Minda",
    faculty: "Medicine",
    phase: "4/7",
    status: "Approved",
  },
  {
    id: "S008",
    name: "Kevin Ortiz",
    faculty: "Engineering",
    phase: "3/7",
    status: "Pending",
  },
  {
    id: "S009",
    name: "Mario Bross",
    faculty: "Arts",
    phase: "7/7",
    status: "Paid",
  },
  {
    id: "S010",
    name: "Luigi Mansion",
    faculty: "Arts",
    phase: "2/7",
    status: "Rejected",
  },
];

// --- 2. FUNCIÓN SIMULADA PARA TANK SATKA QUERY ---
// Simula que va al servidor, espera 1 segundo y devuelve los datos de arriba
const fetchLocalArchive = async () => {
  console.log("📡 Fetching from Secure Archive...");
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Retraso falso
  return MOCK_ARCHIVE_DATA;
};

export const ContractsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- 3. IMPLEMENTACIÓN DE TANK SATKA QUERY ---
  const {
    data: contracts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["archiveData"], // Clave única del caché
    queryFn: fetchLocalArchive, // Usamos la función local de arriba
    staleTime: 1000 * 60 * 5, // 5 minutos de memoria caché
  });

  // Lógica de Filtros
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaculty =
      filterFaculty === "All" || contract.faculty === filterFaculty;
    const matchesStatus =
      filterStatus === "All" || contract.status === filterStatus;
    return matchesSearch && matchesFaculty && matchesStatus;
  });

  // --- LÓGICA DE DESCARGA INTELIGENTE ---
  const handleSmartDownload = (contract) => {
    if (contract.status === "Paid" || contract.status === "Completed") {
      toast.success(`🧾 Downloading Payment Receipt`, {
        description: `Bank transfer proof for ${contract.name}`,
      });
    } else {
      toast.info(`📄 Downloading Application Status Report`, {
        description: `Current Phase: ${contract.phase} for ${contract.name}`,
      });
    }
  };

  const handleGlobalExport = () => {
    toast.success("📊 Exporting Archive Data", {
      description: `Generating Excel file for ${filteredContracts.length} records...`,
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Scholarship Archive
          </h1>
          <p className="text-gray-500">
            Master database of all scholarship applications and history.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGlobalExport}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-bold"
          >
            <Table size={16} /> Export to Excel
          </button>
          <button
            onClick={() => toast("🖨️ Sending to printer...")}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-sm text-sm font-bold"
          >
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center z-10">
        {/* Buscador */}
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search Archive (Name, ID)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-uce-blue transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="pl-4 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-uce-blue text-sm text-gray-600 font-medium"
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
          >
            <option value="All">All Faculties</option>
            <option value="Engineering">Engineering</option>
            <option value="Medicine">Medicine</option>
            <option value="Arts">Arts</option>
          </select>

          <select
            className="pl-4 pr-8 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-uce-blue text-sm text-gray-600 font-medium"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Paid">Paid / Disbursed</option>
          </select>

          <button
            onClick={() => {
              refetch();
            }}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-all"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* TABLA DE DATOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden relative flex flex-col">
        {/* Headers */}
        <div className="bg-gray-50/80 border-b border-gray-200 px-6 py-3 grid grid-cols-12 gap-4 items-center text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0">
          <div className="col-span-3">Applicant</div>
          <div className="col-span-3">Faculty</div>
          <div className="col-span-2">Phase</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Downloads</div>
        </div>

        {/* Rows */}
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <Loader2 size={30} className="text-uce-blue animate-spin mb-2" />
              <p className="text-xs text-gray-500">
                Accessing Secure Archive...
              </p>
            </div>
          ) : filteredContracts.length > 0 ? (
            filteredContracts.map((contract) => (
              <div
                key={contract.id}
                className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group"
              >
                {/* Applicant */}
                <div className="col-span-3">
                  <p className="font-bold text-gray-800 text-sm truncate">
                    {contract.name}
                  </p>
                  <p className="text-xs font-mono text-gray-400">
                    {contract.id}
                  </p>
                </div>

                {/* Faculty */}
                <div className="col-span-3">
                  <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    {contract.faculty}
                  </span>
                </div>

                {/* Phase */}
                <div className="col-span-2">
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                    <div
                      className="bg-uce-blue h-1.5 rounded-full"
                      style={{
                        width: `${(parseInt(contract.phase[0]) / 7) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {contract.phase} Complete
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wide ${
                      contract.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : contract.status === "Approved"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : contract.status === "Rejected"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {contract.status}
                  </span>
                </div>

                {/* SMART ACTIONS */}
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleSmartDownload(contract)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      contract.status === "Paid"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-gray-100 text-gray-600 hover:bg-uce-blue hover:text-white"
                    }`}
                  >
                    {contract.status === "Paid" ? (
                      <>
                        {" "}
                        <FileCheck size={14} /> Receipt{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <FileText size={14} /> Report{" "}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">
              No records found in archive.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
