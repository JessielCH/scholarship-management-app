import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Users, FileCheck, Clock, AlertCircle } from "lucide-react";

// --- MOCK DATA (Simulating Database/Redis Response) ---
const facultyData = [
  { name: "Engineering", value: 30, color: "#003DA5" }, // UCE Blue
  { name: "Medicine", value: 25, color: "#00b894" },
  { name: "Arts", value: 20, color: "#2d3436" },
  { name: "Business", value: 15, color: "#FFD100" }, // UCE Gold
  { name: "Sciences", value: 10, color: "#fab1a0" },
];

const statsData = [
  {
    title: "Total Budget",
    value: "$2.5M",
    icon: <Users size={24} />,
    color: "bg-blue-50 text-uce-blue",
  },
  {
    title: "Active Scholars",
    value: "850",
    icon: <FileCheck size={24} />,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Pending Review",
    value: "150",
    icon: <Clock size={24} />,
    color: "bg-orange-50 text-orange-500",
  },
  {
    title: "Rejected",
    value: "25",
    icon: <AlertCircle size={24} />,
    color: "bg-red-50 text-red-500",
  },
];

const recentContracts = [
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
];

export const DashboardPage = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Overview Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, Administrator. Here is today's report.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Charts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
          <h3 className="font-bold text-gray-800 mb-4">
            Scholarships by Faculty
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={facultyData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {facultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Recent Contracts Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Recent Applications</h3>
            <button className="text-sm text-uce-blue font-medium hover:underline">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="pb-3 pl-2">Student ID</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Faculty</th>
                  <th className="pb-3">Phase</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentContracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 pl-2 font-medium text-gray-600">
                      {contract.id}
                    </td>
                    <td className="py-4 text-gray-800 font-bold">
                      {contract.name}
                    </td>
                    <td className="py-4 text-gray-500">{contract.faculty}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">
                          {contract.phase}
                        </span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-uce-blue"
                            style={{
                              width: `${
                                (parseInt(contract.phase[0]) / 7) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          contract.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : contract.status === "Pending"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {contract.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
