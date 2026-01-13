import { UploadCloud, FileText, X } from "lucide-react";
import { useState } from "react";

export const FileUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop Event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Manual Selection
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed!");
      return;
    }
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        // STATE: FILE SELECTED
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg text-uce-blue">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-700 text-sm">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        // STATE: EMPTY / DRAG ZONE
        <form
          className={`h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all cursor-pointer
            ${
              dragActive
                ? "border-uce-blue bg-blue-50"
                : "border-gray-300 hover:border-uce-gold hover:bg-gray-50"
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".pdf"
            onChange={handleChange}
          />

          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <UploadCloud size={32} className="text-uce-blue" />
          </div>

          <p className="text-lg font-bold text-gray-700">
            Click or drag file to this area to upload
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Support for a single PDF file (Max 5MB)
          </p>
        </form>
      )}
    </div>
  );
};
