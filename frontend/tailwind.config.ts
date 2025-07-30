// Fichier: frontend/tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#007BFF',
        'glass-light': 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(30, 41, 59, 0.4)',
      },
      backdropBlur: {
        'xl': '24px',
      },
      // AJOUT DE L'ANIMATION
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config