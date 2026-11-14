import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: "#0a101c",
        panel: "#131e2d",
        mint: "#adf5c4",
        haze: "#9cadc1",
        coral: "#ff9987",
      },
      fontFamily: { sans: ["Inter", "Arial", "sans-serif"] },
    },
  },
  plugins: [],
};

export default config;
