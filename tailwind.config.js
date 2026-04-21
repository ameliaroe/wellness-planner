/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    'bg-sage-300', 'bg-rose-300', 'bg-blue-300', 'bg-purple-300',
    'bg-yellow-300', 'bg-orange-300', 'bg-pink-300', 'bg-teal-300',
    'text-sage-700', 'text-rose-700', 'text-blue-700', 'text-purple-700',
    'text-yellow-700', 'text-orange-700', 'text-pink-700', 'text-teal-700',
    'bg-sage-100', 'bg-rose-100', 'bg-blue-100', 'bg-purple-100',
    'bg-yellow-100', 'bg-orange-100', 'bg-pink-100', 'bg-teal-100',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        sage: {
          50:  '#f4f8f2',
          100: '#e5f0e1',
          200: '#cde1c6',
          300: '#a8c9a0',
          400: '#7daa74',
          500: '#5a8f51',
          600: '#47733f',
          700: '#3a5d34',
          800: '#304c2b',
          900: '#284024',
        },
        cream: {
          50:  '#fdfcfa',
          100: '#faf6f0',
          200: '#f3ead8',
          300: '#e9d9bf',
          400: '#d9c4a0',
          500: '#c4a878',
        },
      },
    },
  },
  plugins: [],
}
