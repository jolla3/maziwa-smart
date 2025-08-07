const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class', // important!
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        cyan: colors.cyan,
        pink: colors.pink,
        yellow: colors.yellow,
        red: colors.red,
        purple: colors.purple,
        gray: colors.gray,
      },
    },
  },
  plugins: [],
};
