export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#faf4f6',
          100: '#f5e9ed',
          200: '#e6c8d2',
          300: '#d7a7b7',
          400: '#b86481',
          500: '#99214b',
          600: '#8a1e44',
          700: '#731938',
          800: '#5c142d',
          900: '#4b1025',
        }
      }
    },
  },
  plugins: [],
}