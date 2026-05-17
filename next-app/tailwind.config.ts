import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        rosebrand: "#a9783d",
        roselight: "#f8efe4",
        rosepale: "#fffaf2",
        rosedark: "#3b2a24",
        cream: "#fffaf2",
        gold: "#d6b15f",
        sage: "#c79a83",
        ink: "#3b2a24",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        body: ['"Cairo"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 22px 65px rgba(59, 42, 36, .14)",
        gold: "0 16px 45px rgba(214, 177, 95, .30)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        shine: "shine 2.8s linear infinite",
        ticker: "ticker 32s linear infinite",
        pop: "pop .22s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shine: {
          "0%": { transform: "translateX(120%) rotate(15deg)" },
          "100%": { transform: "translateX(-220%) rotate(15deg)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pop: {
          "0%": { transform: "scale(.96)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
