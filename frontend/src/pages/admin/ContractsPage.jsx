import { useState } from "react";
import { Search, Filter, Eye, Download, Loader2 } from "lucide-react"; // Loader icon
import { useQuery } from "@tanstack/react-query"; // <--- TANK SATKA QUERY

// --- API SIMULATION (Esto luego se reemplaza con fetch a Java) ---
const fetchContractsAPI = async () => {
  // Simulamos retardo de red (1.5 segundos)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Datos simulados que vienen del "Backend"
  return [
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
  ];
};

export const ContractsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // --- USANDO TANSTACK QUERY ---
  // isLoading: true mientras carga
  // data: aquí llegan los contratos cuando termina
  // isError: true si falla
  const {
    data: contracts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["contractsList"], // Nombre único para la caché
    queryFn: fetchContractsAPI, // La función que pide los datos
  });

  // --- FILTRADO (Igual que antes, pero ahora sobre 'contracts' que viene de la query) ---
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Master Repository
          </h1>
          <p className="text-gray-500">
            Manage and audit all scholarship applications.
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-uce-blue">
            {isLoading ? "..." : filteredContracts.length}
          </span>
          <span className="text-gray-500 text-sm ml-2">Records found</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Student Name or ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-uce-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {/* Filtros simplificados para el ejemplo */}
          <select
            className="px-4 py-2 border rounded-lg"
            onChange={(e) => setFilterFaculty(e.target.value)}
          >
            <option value="All">All Faculties</option>
            <option value="Engineering">Engineering</option>
            <option value="Medicine">Medicine</option>
          </select>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[300px]">
        {/* ESTADO DE CARGA (Loading State) */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
            <Loader2 className="animate-spin text-uce-blue" size={40} />
            <p>Fetching data from secure server...</p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">
            Error loading contracts.
          </div>
        ) : (
          /* TABLA DE DATOS (Success State) */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Faculty</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-500">
                      {contract.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {contract.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {contract.faculty}
                    </td>
                    <td className="px-6 py-4 font-bold text-uce-blue">
                      {contract.phase}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          contract.status === "Approved" ||
                          contract.status === "Paid"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : contract.status === "Rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-uce-blue hover:bg-white rounded-lg">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
