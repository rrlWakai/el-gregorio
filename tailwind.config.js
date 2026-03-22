/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2f6b3f',
          50: '#f0f7f2',
          100: '#dceedf',
          200: '#bbddc2',
          300: '#8ec49d',
          400: '#5ea474',
          500: '#2f6b3f',
          600: '#265a34',
          700: '#1f4829',
          800: '#193a21',
          900: '#14301c',
        },
        accent: {
          DEFAULT: '#cfa85a',
          50: '#fdf8ed',
          100: '#f9eed4',
          200: '#f2d9a3',
          300: '#e9c06a',
          400: '#cfa85a',
          500: '#b8903e',
          600: '#9a7431',
          700: '#7c5c28',
          800: '#664c22',
          900: '#56401e',
        },
        bg: '#f6f7f4',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
