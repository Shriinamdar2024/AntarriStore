/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '475px',
      },
      colors: {
        primary: "#f8fafc", // Light Slate 50
        secondary: "#ffffff", // Pure White
        tertiary: "#f1f5f9", // Slate 100 for soft borders
        surface: "#ffffff",
        accent: "#0ea5e9", // Sky Blue 500 for vibrant pops
        accentHover: "#0284c7", // Sky Blue 600
        textPrimary: "#0f172a", // Slate 900
        textSecondary: "#64748b", // Slate 500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}