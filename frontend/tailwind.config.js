/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        uce: {
          blue: "#003DA5", // Azul UCE
          gold: "#FFD100", // Dorado UCE
        },
      },
    },
  },
  plugins: [],
};
