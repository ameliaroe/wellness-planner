/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    // habit palette — dynamic class names need safelisting
    'bg-coral-300', 'bg-orange-300', 'bg-amber-300', 'bg-yellow-300',
    'bg-teal-300',  'bg-cyan-300',   'bg-sky-300',   'bg-purple-300',
    'bg-coral-100', 'bg-orange-100', 'bg-amber-100', 'bg-yellow-100',
    'bg-teal-100',  'bg-cyan-100',   'bg-sky-100',   'bg-purple-100',
    'bg-coral-50',  'bg-teal-50',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: {
          50:  '#fff5f2',
          100: '#ffe8e2',
          200: '#ffd0c3',
          300: '#ffad99',
          400: '#f47c63',
          500: '#e8604a',
          600: '#d44433',
          700: '#b03628',
          800: '#8e2e22',
          900: '#75291e',
        },
        teal: {
          50:  '#f0fafa',
          100: '#d8f2f2',
          200: '#b0e4e4',
          300: '#7dd0d0',
          400: '#46b8b8',
          500: '#2ea0a0',
          600: '#248282',
          700: '#216868',
          800: '#1e5454',
          900: '#1b4646',
        },
        cream: {
          50:  '#fefdfb',
          100: '#fdf8f2',
          200: '#f9eddf',
          300: '#f2e0c8',
          400: '#e8cfb0',
          500: '#d4b48a',
        },
      },
    },
  },
  plugins: [],
}
