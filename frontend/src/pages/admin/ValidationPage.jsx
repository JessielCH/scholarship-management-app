import { useState } from "react";
import {
  CheckSquare,
  Square,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button"; // Reusing our button component

export const ValidationPage = () => {
  const navigate = useNavigate();

  // --- STATE: Form Data ---
  const [feedback, setFeedback] = useState("");

  // Checklist State
  const [checks, setChecks] = useState({
    signatureMatches: false,
    bankCertificate: false,
    datesCorrect: false,
    termsMet: false,
    attachments: false,
  });

  // Toggle Checkbox logic
  const toggleCheck = (key) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Mock Actions
  const handleApprove = () => {
    const allChecked = Object.values(checks).every(Boolean);
    if (!allChecked) {
      alert("⚠️ Please complete the checklist before approving.");
      return;
    }
    alert("✅ Contract VALIDATED & APPROVED. Proceeding to Payment Phase.");
    navigate("/dashboard");
  };

  const handleReject = () => {
    if (!feedback) {
      alert("⚠️ Please provide a rejection reason in the feedback box.");
      return;
    }
    alert(`❌ Contract REJECTED. Reason sent to student: "${feedback}"`);
    navigate("/dashboard");
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      {/* HEADER: Navigation & Title */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Contract Validation{" "}
            <span className="text-gray-400 font-normal text-lg">
              #SCH-2026-889
            </span>
          </h1>
          <p className="text-sm text-gray-500">
            Reviewing application for:{" "}
            <span className="font-bold text-uce-blue">
              Alice Johnson (Engineering)
            </span>
          </p>
        </div>
      </div>

      {/* MAIN SPLIT VIEW */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* LEFT COLUMN: PDF Viewer (Mock) */}
        <div className="bg-gray-800 rounded-2xl shadow-inner flex flex-col overflow-hidden border border-gray-600">
          {/* Fake PDF Toolbar */}
          <div className="bg-gray-900 p-3 flex justify-between items-center text-gray-400 text-xs px-4">
            <span>contract_alice_signed.pdf</span>
            <div className="flex gap-2">
              <span className="cursor-pointer hover:text-white">
                Page 1 / 3
              </span>
              <span className="cursor-pointer hover:text-white">Zoom +</span>
            </div>
          </div>

          {/* PDF Preview Area */}
          <div className="flex-1 bg-gray-500 flex items-center justify-center p-8 overflow-y-auto">
            <div className="bg-white w-full max-w-md h-full shadow-2xl p-8 text-[10px] text-gray-400 select-none">
              {/* Visual Representation of a Document */}
              <div className="w-full h-4 bg-gray-200 mb-4"></div>
              <div className="w-2/3 h-4 bg-gray-200 mb-8"></div>
              <div className="space-y-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-full h-2 bg-gray-100"></div>
                ))}
              </div>
              <div className="mt-12 pt-4 border-t border-gray-300 flex justify-between items-end">
                <div>
                  <div className="w-24 h-8 border-b border-black mb-1 font-handwriting text-blue-900 text-lg">
                    Alice J.
                  </div>
                  <span>Student Signature</span>
                </div>
                <div className="opacity-50">
                  <div className="w-24 h-8 border-b border-gray-300 mb-1"></div>
                  <span>Admin Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Validation Tools */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col overflow-y-auto">
          {/* Section: Details */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-uce-blue" /> Contract Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Date Signed</p>
                <p className="font-medium text-gray-700">Jan 09, 2026</p>
              </div>
              <div>
                <p className="text-gray-400">Amount</p>
                <p className="font-medium text-gray-700">$2,500.00 / Sem</p>
              </div>
            </div>
          </div>

          {/* Section: Checklist */}
          <div className="mb-6 flex-1">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CheckSquare size={18} className="text-uce-blue" /> Validation
              Checklist
            </h3>
            <div className="space-y-3">
              {[
                {
                  key: "signatureMatches",
                  label: "Signature Matches ID Document",
                },
                { key: "bankCertificate", label: "Bank Certificate Valid" },
                { key: "datesCorrect", label: "Contract Dates are Correct" },
                { key: "termsMet", label: "Academic Terms & Conditions Met" },
                {
                  key: "attachments",
                  label: "All Required Attachments Present",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                    ${
                      checks[item.key]
                        ? "bg-blue-50 border-uce-blue/30 text-uce-blue"
                        : "border-gray-100 hover:bg-gray-50 text-gray-600"
                    }
                  `}
                >
                  {checks[item.key] ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Square size={20} />
                  )}
                  <span className="text-sm font-medium select-none">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Feedback & Actions */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            <label className="text-sm font-bold text-gray-700 mb-2 block">
              Feedback / Rejection Reason
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-uce-blue focus:border-transparent outline-none mb-4"
              rows="3"
              placeholder="Add specific notes if rejecting..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="danger"
                onClick={handleReject}
                className="flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white"
              >
                <XCircle size={18} /> REJECT
              </Button>

              <Button
                variant="primary"
                onClick={handleApprove}
                className="flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
              >
                <CheckCircle size={18} /> VALIDATE & APPROVE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
