import { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  BrainCircuit,
  CheckCircle,
  Save,
} from "lucide-react";
import { toast, Toaster } from "sonner";

export const SelectionPage = () => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Analyzing, 3: Results
  const [selectedFile, setSelectedFile] = useState(null);
  const [candidates, setCandidates] = useState([]);

  // MOCK DATA: Simulación de datos provenientes del SIIU
  const mockSIIUData = [
    {
      id: "175001",
      name: "Pedro Pascal",
      average: 9.8,
      quintile: 1,
      score: 98,
      status: "Selected",
    },
    {
      id: "175002",
      name: "Dua Lipa",
      average: 9.5,
      quintile: 1,
      score: 95,
      status: "Selected",
    },
    {
      id: "175003",
      name: "Elon Musk",
      average: 7.0,
      quintile: 5,
      score: 40,
      status: "Rejected",
    },
    {
      id: "175004",
      name: "Shakira Mebarak",
      average: 9.2,
      quintile: 2,
      score: 89,
      status: "Selected",
    },
    {
      id: "175005",
      name: "Homero Simpson",
      average: 6.5,
      quintile: 4,
      score: 35,
      status: "Rejected",
    },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      toast.success("SIIU Database loaded successfully!");
    }
  };

  const runAISelection = () => {
    setStep(2); // Inicia animación de carga

    // Simula el tiempo de proceso del algoritmo
    setTimeout(() => {
      setCandidates(mockSIIUData);
      setStep(3); // Muestra resultados
      toast.success("Algorithm execution complete. Top 10% selected.");
    }, 3000);
  };

  const confirmScholarships = () => {
    toast.success("🎉 50 New Scholarships Created!", {
      description: "Emails have been sent to selected students.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BrainCircuit className="text-uce-blue" size={32} />
          Intelligent Selection Module
        </h1>
        <p className="text-gray-500">
          Import data from SIIU and use the Algorithm to select the best
          candidates (Top 10%).
        </p>
      </div>

      {/* STEP 1: UPLOAD AREA */}
      {step === 1 && (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center space-y-6">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <FileSpreadsheet size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Import SIIU Database
            </h2>
            <p className="text-gray-500">
              Upload the .CSV or .XLSX file exported from the University System.
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 hover:bg-gray-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud size={48} className="mx-auto text-gray-300 mb-4" />
            {selectedFile ? (
              <p className="text-uce-blue font-bold text-lg">
                {selectedFile.name}
              </p>
            ) : (
              <p className="text-gray-400">Drag & drop or click to upload</p>
            )}
          </div>

          {selectedFile && (
            <button
              onClick={runAISelection}
              className="bg-uce-blue text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 mx-auto"
            >
              <BrainCircuit /> Run Selection Algorithm
            </button>
          )}
        </div>
      )}

      {/* STEP 2: LOADING SIMULATION */}
      {step === 2 && (
        <div className="bg-white p-20 rounded-3xl shadow-sm border border-gray-100 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-uce-blue border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
            Processing Data...
          </h2>
          <p className="text-gray-500 mt-2">
            Analyzing academic records and socioeconomic factors.
          </p>
          <div className="mt-8 max-w-md mx-auto bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-uce-blue h-full animate-progress w-full origin-left transition-all duration-[3000ms]"></div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULTS */}
      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-700">
          {/* STATS */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Total Imported
              </p>
              <p className="text-3xl font-bold text-gray-800">1,240</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-blue-100 bg-blue-50/50 shadow-sm">
              <p className="text-xs font-bold text-uce-blue uppercase">
                Selected (10%)
              </p>
              <p className="text-3xl font-bold text-uce-blue">124</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Cut-off Score
              </p>
              <p className="text-3xl font-bold text-gray-800">
                85<span className="text-sm text-gray-400">/100</span>
              </p>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Preview: Selected Candidates
              </h3>
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                Ready to Import
              </span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Average (60%)</th>
                  <th className="p-4">Quintile (40%)</th>
                  <th className="p-4">Final Score</th>
                  <th className="p-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {candidates.map((c) => (
                  <tr
                    key={c.id}
                    className={
                      c.status === "Selected"
                        ? "bg-blue-50/30"
                        : "opacity-50 grayscale"
                    }
                  >
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.id}</p>
                    </td>
                    <td className="p-4 font-mono">{c.average}/10</td>
                    <td className="p-4">Q{c.quintile}</td>
                    <td className="p-4 font-bold text-uce-blue">
                      {c.score} pts
                    </td>
                    <td className="p-4 text-right">
                      {c.status === "Selected" ? (
                        <span className="flex items-center justify-end gap-1 text-green-600 font-bold text-xs">
                          <CheckCircle size={14} /> Selected
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs font-medium">
                          Cut-off
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={confirmScholarships}
              className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 flex items-center gap-2"
            >
              <Save size={20} /> Generate Scholarships & Notify
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
