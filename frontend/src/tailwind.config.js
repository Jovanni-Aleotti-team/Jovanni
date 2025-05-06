export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          neon: '#5B6CFF',
          cyber: '#00FF9D',
          dark: '#0F0F1F',
        },
        fontFamily: {
          exo: ['"Exo 2"', 'sans-serif'],
        },
        animation: {
          glow: "glow 2s ease-in-out infinite alternate",
          fadeIn: "fadeIn 1s ease-in-out",
        },
        keyframes: {
          glow: {
            '0%': { opacity: '0.8' },
            '100%': { opacity: '1' },
          },
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
      },
    },
    plugins: [],
  }
  