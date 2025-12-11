import type { Config } from "tailwindcss";

const primary = {
  50: "#fff4ed",
  100: "#ffe6d8",
  200: "#f9cbb1",
  300: "#f3a989",
  400: "#ef845b",
  500: "#eb5d1f", // primary
  600: "#d44f18",
  700: "#b24115",
  800: "#8f3412",
  900: "#6f2a0f",
};

export default {
  content: [
    "./app/**/*.{vue,ts}",
    "./components/**/*.{vue,ts}",
    "./layouts/**/*.{vue,ts}",
    "./pages/**/*.{vue,ts}",
    "./plugins/**/*.{js,ts}",
    "./stores/**/*.ts",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: primary,
        primary,
      },
    },
  },
  plugins: [],
} satisfies Config;
