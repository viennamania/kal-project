import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1E2451",
        candy: "#FF6FA8",
        sky: "#58C3FF",
        mint: "#61E9C6",
        peach: "#FFD787",
        bubble: "#F5FAFF"
      },
      boxShadow: {
        bubble: "0 20px 60px rgba(39, 84, 153, 0.12)",
        soft: "0 12px 28px rgba(30, 36, 81, 0.08)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      animation: {
        drift: "drift 9s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite"
      },
      backgroundImage: {
        confetti:
          "radial-gradient(circle at 20% 20%, rgba(88,195,255,0.18), transparent 40%), radial-gradient(circle at 80% 10%, rgba(255,111,168,0.16), transparent 35%), radial-gradient(circle at 80% 80%, rgba(97,233,198,0.16), transparent 35%), linear-gradient(180deg, #FDFEFF 0%, #FFF7F2 100%)"
      }
    }
  },
  plugins: []
};

export default config;
