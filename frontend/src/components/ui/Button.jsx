export const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
  type = "button",
}) => {
  const baseStyles =
    "w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md";

  const variants = {
    primary: "bg-uce-blue text-white hover:bg-blue-800",
    outline:
      "bg-white border-2 border-gray-200 text-gray-700 hover:border-uce-blue hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};
