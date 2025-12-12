/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f5ff',
          100: '#e8eaff',
          200: '#c9ccff',
          300: '#9ea4ff',
          400: '#6570ff',
          500: '#3440ff',
          600: '#1f29e6',
          700: '#1720b4',
          800: '#111886',
          900: '#0b1059'
        }
      }
    }
  },
  plugins: []
}
