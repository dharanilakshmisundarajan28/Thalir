/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32', // Agriculture Green
        secondary: '#81C784',
        accent: '#FFD54F', // Sun/Crops output
        dark: '#1B1B1B',
        light: '#F5F5F5'
      }
    },
  },
  plugins: [],
}
