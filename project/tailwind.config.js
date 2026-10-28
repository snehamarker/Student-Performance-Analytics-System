/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2f8",
          100: "#d8e0ee",
          200: "#b3c1dd",
          300: "#8498c4",
          400: "#5a72a6",
          500: "#3d5487",
          600: "#2c3d68",
          700: "#1f2d4d",
          800: "#15203a",
          900: "#0d152a",
        },
        lavender: {
          50: "#f7f5ff",
          100: "#efeaff",
          200: "#dfd5ff",
          300: "#c8b5ff",
          400: "#ac8efb",
          500: "#9770f0",
          600: "#7c52d6",
          700: "#6a40b0",
          800: "#56368c",
          900: "#3f2866",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 21 42 / 0.06), 0 1px 2px -1px rgb(15 21 42 / 0.05)",
        cardLg: "0 10px 30px -12px rgb(15 21 42 / 0.18)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
