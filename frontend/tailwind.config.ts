// Fichier: frontend/tailwind.config.ts
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
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
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
