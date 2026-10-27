/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      animation: {
        "rain-fall": "rainFall 0.8s linear infinite",
        "water-flow": "waterFlow 3s linear infinite",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "warning-pulse": "warningPulse 1.5s ease-in-out infinite",
      },

      keyframes: {
        rainFall: {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "20%": {
            opacity: "1",
          },
          "100%": {
            transform: "translateY(100vh)",
            opacity: "0.2",
          },
        },

        waterFlow: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },

        pulseSoft: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.75",
            transform: "scale(1.02)",
          },
        },

        warningPulse: {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 0 rgba(239, 68, 68, 0)",
          },
          "50%": {
            opacity: "0.85",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.35)",
          },
        },
      },

      boxShadow: {
        dashboard:
          "0 20px 60px rgba(15, 23, 42, 0.12)",
      },
    },
  },

  plugins: [],
};