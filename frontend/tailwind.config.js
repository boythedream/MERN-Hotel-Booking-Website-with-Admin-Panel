/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14251F",
          50: "#EAF0EC",
          100: "#CBDACF",
          400: "#3F5C4E",
          600: "#1F3931",
          900: "#14251F",
        },
        paper: {
          DEFAULT: "#EEEAE1",
          soft: "#F5F2EA",
          dim: "#E2DCCE",
        },
        brass: {
          DEFAULT: "#A9812F",
          light: "#C9A24B",
          dark: "#7C5E22",
        },
        clay: {
          DEFAULT: "#8C5A44",
          light: "#AD7B62",
        },
        moss: "#4C6B4F",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
