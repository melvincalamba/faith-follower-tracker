/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   {
          50:  '#fdf8f0',
          100: '#faeedd',
          200: '#f5d9b5',
          300: '#eebe85',
          400: '#e5a054',
          500: '#dc8530',
          600: '#c96d22',
          700: '#a8541d',
          800: '#87421e',
          900: '#6e371b',
        },
        warm: {
          50:  '#fdfcfb',
          100: '#f7f3ee',
          200: '#ede4d8',
          300: '#dfd0bc',
          400: '#ccb49a',
          500: '#b8977a',
          600: '#9e7a5e',
          700: '#7d5f48',
          800: '#5e4636',
          900: '#3d2d22',
        },
        accent: {
          50:  '#f0f9f4',
          100: '#dcf0e5',
          200: '#bbe0cd',
          300: '#8dc9ab',
          400: '#5baa84',
          500: '#3a8f68',
          600: '#2a7252',
          700: '#235c43',
          800: '#1e4a37',
          900: '#1a3d2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl':  '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'warm': '0 2px 15px rgba(188, 150, 110, 0.15)',
        'card': '0 1px 8px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}