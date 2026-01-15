import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  FileText,
  ChevronRight,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// MOCK DATA: Pending Applications
const pendingReviews = [
  {
    id: "S002",
    name: "Juan Perez",
    faculty: "Medicine",
    document: "scholarship_agreement.pdf",
    phase: "Validation",
  },
  {
    id: "S006",
    name: "Luis Vega",
    faculty: "Sciences",
    document: "bank_certificate.pdf",
    phase: "Validation",
  },
  {
    id: "S008",
    name: "Kevin Ortiz",
    faculty: "Engineering",
    document: "id_copy.pdf",
    phase: "Validation",
  },
];

export const ValidationPage = () => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Validation Checkbox State
  const [checks, setChecks] = useState({
    signature: false,
    dates: false,
    bank: false,
  });

  const currentApplication =
    currentIndex !== null ? pendingReviews[currentIndex] : null;

  const toggleCheck = (key) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDecision = (decision) => {
    // VALIDATION: Reject requires feedback
    if (decision === "reject" && feedback.trim().length < 5) {
      toast.error(
        "⚠️ Feedback is required to reject an application. Please explain why."
      );
      return;
    }

    // 1. Notification
    if (decision === "approve") {
      toast.success(`✅ Application Approved: ${currentApplication.name}`);
    } else {
      toast.info(`🚫 Application Rejected. Feedback sent to student.`);
    }

    // 2. RESET FORM (Clear for next student)
    setFeedback("");
    setChecks({ signature: false, dates: false, bank: false });

    // 3. AUTO-ADVANCE LOGIC
    if (currentIndex < pendingReviews.length - 1) {
      // Move to next student instantly
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more students
      toast.success("🎉 All pending reviews completed!");
      setCurrentIndex(null); // Back to list
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <Toaster position="top-center" richColors />

      {/* VIEW 1: INBOX LIST */}
      {currentIndex === null ? (
        <>
          <h1 className="text-3xl font-bold text-gray-800">Pending Reviews</h1>
          <p className="text-gray-500">
            Inbox: You have {pendingReviews.length} documents waiting for
            validation.
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Faculty</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingReviews.map((app, index) => (
                  <tr
                    key={app.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-4 font-medium">
                      {app.name}{" "}
                      <span className="text-xs text-gray-400 block">
                        {app.id}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{app.faculty}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setCurrentIndex(index)}
                        className="text-sm bg-uce-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 ml-auto"
                      >
                        Start Review <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* VIEW 2: VALIDATION WORKSPACE */
        <>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-uce-blue transition-colors"
            >
              <ArrowLeft size={20} /> Back to Inbox
            </button>
            <div className="text-sm font-bold text-gray-400">
              Reviewing {currentIndex + 1} of {pendingReviews.length}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            {/* LEFT: DOCUMENT VIEWER */}
            <div className="bg-gray-800 rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-inner">
              <div className="text-center text-white/50 group-hover:text-white transition-colors">
                <FileText size={64} className="mx-auto mb-4" />
                <p>PDF Viewer Simulator</p>
                <p className="text-sm font-mono mt-2 text-blue-300">
                  {currentApplication.document}
                </p>
              </div>
            </div>

            {/* RIGHT: CONTROL PANEL */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col overflow-y-auto">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentApplication.name}
                </h2>
                <p className="text-uce-blue font-medium">
                  {currentApplication.faculty} • {currentApplication.id}
                </p>
              </div>

              {/* CHECKLIST */}
              <div className="space-y-3 mb-6">
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">
                  Acceptance Criteria
                </h3>

                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    checks.signature
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checks.signature}
                    onChange={() => toggleCheck("signature")}
                    className="w-5 h-5 accent-uce-blue"
                  />
                  <span className="text-gray-700 text-sm">
                    Signature matches ID Document
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    checks.dates
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checks.dates}
                    onChange={() => toggleCheck("dates")}
                    className="w-5 h-5 accent-uce-blue"
                  />
                  <span className="text-gray-700 text-sm">
                    Valid dates within academic period
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                    checks.bank
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checks.bank}
                    onChange={() => toggleCheck("bank")}
                    className="w-5 h-5 accent-uce-blue"
                  />
                  <span className="text-gray-700 text-sm">
                    Bank Certificate attached & legible
                  </span>
                </label>
              </div>

              {/* FEEDBACK SECTION */}
              <div className="mb-6 flex-1">
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  Feedback / Reason for Rejection <MessageSquare size={14} />
                </h3>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g., The signature is blurry. Please upload a high-resolution scan..."
                  className="w-full h-24 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-uce-blue focus:border-transparent resize-none"
                />
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                  onClick={() => handleDecision("reject")}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-all text-sm"
                >
                  <XCircle size={18} /> Reject
                </button>

                <button
                  onClick={() => handleDecision("approve")}
                  // Disable approve if not all checks are met
                  disabled={!checks.signature || !checks.dates || !checks.bank}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-uce-blue text-white font-bold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-lg shadow-blue-900/10"
                >
                  <CheckCircle size={18} /> Approve
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
