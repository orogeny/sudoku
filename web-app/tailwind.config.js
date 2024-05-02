/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "cool-gray-300": "#d1d5db",
        "cool-gray-400": "#9ca3af",
      },
      flexBasis: {
        "1/9": "11.11111111%",
      },
    },
    fontFamily: { sans: ["Nunito", "sans-serif"] },
  },
  plugins: [],
};
