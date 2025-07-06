/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        roxanaPurple: {
          light: "#a78bfa", // lighter purple
          DEFAULT: "#7c3aed", // deeper purple
          dark: "#5b21b6",
        },
        roxanaPink: {
          light: "#f9a8d4",
          DEFAULT: "#ec4899", // deeper pink
          dark: "#be185d",
        },
        roxanaGray: {
          DEFAULT: "#374151", // neutral gray for text
        },
      },
    },
  },
  plugins: [],
};
