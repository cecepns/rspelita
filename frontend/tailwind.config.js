/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pelitaGreen: '#059669',
        pelitaRed: '#dc2626',
      },
    },
  },
  plugins: [],
}
