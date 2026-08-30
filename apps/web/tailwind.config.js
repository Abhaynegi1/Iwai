/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact Iwai Design System from mobile
        forest: {
          DEFAULT: "#123C35", // Deep Forest primary
          hover: "#0D2E28",
          light: "rgba(18, 60, 53, 0.08)",
          lighter: "rgba(18, 60, 53, 0.04)",
          dark: "#0E302A",
        },
        emerald: {
          DEFAULT: "#1E7A67",
          hover: "#186354",
          light: "rgba(30, 122, 103, 0.12)",
        },
        mint: {
          DEFAULT: "#43D399",
          light: "rgba(67, 211, 153, 0.18)",
        },
        apricot: {
          DEFAULT: "#FFB86C",
          light: "rgba(255, 184, 108, 0.18)",
        },
        coral: {
          DEFAULT: "#E05353",
          light: "rgba(224, 83, 83, 0.12)",
        },
        surface: {
          DEFAULT: "#FFFDF8", // Ivory
          warm: "#F4F3EE",
          elevated: "#FFFFFF",
          card: "#FFFDF8",
          cardHover: "#F9F6EE",
        },
        warm: {
          50: "#FCFCFA",
          100: "#F7F7F5", // Warm White Background
          200: "#EFEFEA",
          300: "#E5E7E2", // Default Border
          400: "#D4D7CE",
          500: "#B8BFBC",
        },
        ink: {
          DEFAULT: "#0F1720", // Text Primary
          secondary: "#68736F", // Text Secondary
          muted: "#9BA3A0",
          disabled: "#B8BFBC",
          inverse: "#FFFDF8",
        },
        // Brand palette mapping for convenience
        brand: {
          50: "#f2f8f6",
          100: "#e1efe9",
          200: "#c4dfd4",
          300: "#99c6b6",
          400: "#6ba995",
          500: "#1E7A67", // Emerald
          600: "#176756",
          700: "#125144",
          800: "#123C35", // Deep Forest
          900: "#0e302a",
          950: "#071c17",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        handwriting: ["var(--font-handwriting)", "cursive"],
      },
    },
  },
  plugins: [],
};
