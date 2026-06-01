/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          scarlet: '#940000',
          'dark-red': '#660000',
          gold: '#C5A44E',
          marine: '#001E54',
          gray: '#818283',
          'light-gray': '#A7A7A7',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Arial', 'Helvetica', 'sans-serif'],
      },
      borderRadius: {
        brand: '4px',
      },
    },
  },
  plugins: [],
};
