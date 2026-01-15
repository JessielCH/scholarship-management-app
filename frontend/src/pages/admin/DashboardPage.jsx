import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  Users,
  FileText,
  DollarSign,
  Activity,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // --- MOCK DATA (Simulando la base de datos) ---
  const allApplications = [
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
      phase: "1/7",
      status: "Pending",
    },
  ];

  // Cálculos rápidos para las tarjetas de estadísticas
  const totalStudents = allApplications.length;
  const pendingCount = allApplications.filter(
    (a) => a.status === "Pending" || a.status === "Under Review"
  ).length;
  const approvedCount = allApplications.filter(
    (a) => a.status === "Approved" || a.status === "Paid"
  ).length;

  return (
    <div className="space-y-8">
      {/* 1. WELCOME HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "Admin"}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Here is what’s happening with scholarships today.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm text-gray-400">System Status</p>
          <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-xs">
            <Activity size={14} /> Operational
          </div>
        </div>
      </div>

      {/* 2. STATS CARDS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Applicants */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-50 text-uce-blue rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Total Applicants
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {totalStudents}
            </h3>
          </div>
        </div>

        {/* Card 2: Pending Reviews (Urgent) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-orange-100 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl relative z-10">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Pending Action
            </p>
            <h3 className="text-3xl font-bold text-gray-800">{pendingCount}</h3>
          </div>
        </div>

        {/* Card 3: Approved / Budget Impact */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Approved Grants
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {approvedCount}
            </h3>
          </div>
        </div>
      </div>

      {/* 3. REQUIRES ATTENTION TABLE (Option A Implementation) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="text-orange-500" size={20} /> Requires Attention
            </h3>
            <p className="text-sm text-gray-500">
              Inbox: Applications waiting for validation.
            </p>
          </div>
          <button
            onClick={() => navigate("/validation")}
            className="text-uce-blue text-sm font-bold hover:underline flex items-center gap-1 group"
          >
            Process all pending{" "}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 pl-2">Student</th>
                <th className="pb-3">Wait Time</th>
                <th className="pb-3">Current Phase</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* FILTER: Only show Pending or Under Review */}
              {allApplications
                .filter(
                  (app) =>
                    app.status === "Pending" || app.status === "Under Review"
                )
                .slice(0, 5) // Show top 5 only
                .map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => navigate("/validation")} // CLICK ROW -> GO TO VALIDATION
                    className="group hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        {/* Avatar Mockup */}
                        <div className="w-8 h-8 rounded-full bg-uce-gold/20 text-uce-gold flex items-center justify-center font-bold text-xs">
                          {app.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm group-hover:text-uce-blue transition-colors">
                            {app.name}
                          </p>
                          <p className="text-xs text-gray-400">{app.faculty}</p>
                        </div>
                      </div>
                    </td>

                    {/* URGENCY BADGE */}
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit border border-orange-100">
                        <TrendingUp size={12} />
                        <span>2 days wait</span>
                      </div>
                    </td>

                    {/* PROGRESS BAR */}
                    <td className="py-4 w-1/4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-gray-500">
                          Phase {app.phase}
                        </span>
                        <span className="text-gray-400">
                          {Math.round((parseInt(app.phase[0]) / 7) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-uce-blue rounded-full transition-all duration-500"
                          style={{
                            width: `${(parseInt(app.phase[0]) / 7) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </td>

                    {/* CALL TO ACTION BUTTON */}
                    <td className="py-4 text-right pr-2">
                      <span className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg font-bold group-hover:bg-uce-blue group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
                        Review Now
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* EMPTY STATE */}
          {pendingCount === 0 && (
            <div className="text-center py-12">
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <p className="text-gray-800 font-bold">All caught up!</p>
              <p className="text-gray-500 text-sm">
                No pending applications requiring attention.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
