/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Simple, professional, light palette (slate + muted blue accent)
        brand: {
          50: "#f5f7fa",
          100: "#e9edf3",
          500: "#5b7793",
          600: "#40597a",
          700: "#334a66",
        },
      },
    },
  },
  plugins: [],
};
