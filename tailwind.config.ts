import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#030a13",
        panel: "#081421",
        low: "#14b86f",
        elevated: "#f4b000",
        high: "#ff4a5f"
      },
      boxShadow: {
        neon: "0 0 32px rgba(254, 207, 0, 0.25)",
        glass: "0 18px 36px rgba(0, 0, 0, 0.4)"
      },
      backdropBlur: {
        panel: "24px"
      },
      keyframes: {
        sweep: {
          "0%": { transform: "translateX(-40%)" },
          "100%": { transform: "translateX(40%)" }
        }
      },
      animation: {
        sweep: "sweep 8s ease-in-out infinite alternate"
      }
    }
  },
  plugins: []
};

export default config;
