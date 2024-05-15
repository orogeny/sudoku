/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "cool-gray": {
          300: "#d1d5db",
          400: "#9ca3af",
        },
        turquoise: {
          50: "#F3FEFD",
          100: "#E6FDFC",
          200: "#C1F9F7",
          300: "#9CF6F2",
          400: "#52EFE8",
          500: "#08E8DE",
          600: "#07D1C8",
          700: "#058B85",
          800: "#046864",
          900: "#024643",
        },
      },
      flexBasis: {
        "1/9": "11.11111111%",
      },
    },
    fontFamily: { sans: ["Nunito", "sans-serif"] },
  },
  plugins: [],
};
