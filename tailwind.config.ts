import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-studio-display)", "Georgia", "serif"],
        sans: ["var(--font-studio-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0c0f0e",
        paper: "#f4f1ea",
        mist: "#8a8f88",
        line: "#232826",
      },
    },
  },
  plugins: [],
};

export default config;
