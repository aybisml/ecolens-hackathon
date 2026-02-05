/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "neon-green": "#00ff9d",
        "neon-blue": "#00f3ff",
        "neon-red": "#ff0055",
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', "monospace"], // Font hacker
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        scan: "scan 2s linear infinite",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        scan: {
          "0%": { top: "0%" },
          "50%": { top: "100%" },
          "100%": { top: "0%" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
