/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // New Blue Design System
        primary: {
          DEFAULT: "#3B82F6", // Primary Blue
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE", // Light Blue
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6", // Primary Blue
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E3A8A", // Dark Navy
          900: "#1E3A8A", // Dark Navy
        },
        // Legacy colors for backward compatibility (mapped to blue)
        roxanaPurple: {
          light: "#93C5FD",
          DEFAULT: "#3B82F6",
          dark: "#1E3A8A",
        },
        roxanaPink: {
          light: "#BFDBFE",
          DEFAULT: "#3B82F6",
          dark: "#1D4ED8",
        },
        roxanaGray: {
          DEFAULT: "#374151",
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        medium:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
