import { useState } from "react";
import { Timeline } from "../../components/ui/Timeline";
import { FileUploader } from "../../components/ui/FileUploader";
import { Bell, Download } from "lucide-react";

export const TrackerPage = () => {
  // Current Phase (4 = Student Signature)
  const currentStep = 4;
  const [file, setFile] = useState(null);

  const handleUploadSubmit = () => {
    if (!file) return;
    alert(`Simulating Upload to Firebase: ${file.name}`);
    // Here we will add the Firebase Logic later
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            My Scholarship Journey
          </h1>
          <p className="text-gray-500">
            Track your application status and required actions.
          </p>
        </div>
        <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100 relative cursor-pointer hover:bg-gray-50">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
      </div>

      {/* 1. TIMELINE COMPONENT */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <h3 className="font-bold text-gray-800 mb-6">Process Status</h3>
        <Timeline currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Action Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-uce-gold/20 p-2 rounded-lg text-uce-blue font-bold">
                Step 4
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Student Signature Required
              </h3>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Congratulations! Your scholarship has been approved for the
              drafting phase. Please download the generated contract below, sign
              it, and upload the scanned PDF to proceed to the Validation phase.
            </p>

            {/* Download Button Mock */}
            <button className="flex items-center gap-2 text-uce-blue font-bold hover:underline mb-8">
              <Download size={20} />
              Download Contract Template (PDF)
            </button>

            {/* 2. UPLOAD COMPONENT */}
            <h4 className="font-bold text-gray-700 mb-4">
              Upload Signed Document
            </h4>
            <FileUploader onFileSelect={(f) => setFile(f)} />

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUploadSubmit}
                disabled={!file}
                className={`px-6 py-3 rounded-xl font-bold transition-all
                  ${
                    file
                      ? "bg-uce-blue text-white hover:bg-blue-800 shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Submit Contract
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Notifications</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="w-2 h-2 mt-2 bg-uce-blue rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Document submission deadline approaching
                    </p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
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
