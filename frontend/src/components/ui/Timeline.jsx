import { Check, Circle } from "lucide-react";

// --- COMPONENT: PROGRESS TIMELINE ---
export const Timeline = ({ currentStep }) => {
  // Steps definition based on your PDF
  const steps = [
    { id: 1, label: "Awarded" },
    { id: 2, label: "Data Check" },
    { id: 3, label: "Contract Gen" },
    { id: 4, label: "Signature" }, // Active Step
    { id: 5, label: "Validation" },
    { id: 6, label: "Legal Process" },
    { id: 7, label: "Payment" },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Background Gray Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>

        {/* Background Blue Line (Progress) */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-uce-blue -z-10 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {/* Steps Render */}
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center bg-gray-50 px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all
                  ${
                    isCompleted
                      ? "bg-uce-blue border-uce-blue text-white"
                      : isActive
                      ? "bg-white border-uce-blue text-uce-blue shadow-lg scale-110"
                      : "bg-white border-gray-300 text-gray-300"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <span className="font-bold text-sm">{step.id}</span>
                )}
              </div>

              <span
                className={`text-xs mt-2 font-semibold ${
                  isActive ? "text-uce-blue" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
