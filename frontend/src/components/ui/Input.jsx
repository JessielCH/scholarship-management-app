export const Input = ({ label, type = "text", placeholder }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 block text-left">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-uce-blue focus:border-transparent outline-none transition-all"
      />
    </div>
  );
};
