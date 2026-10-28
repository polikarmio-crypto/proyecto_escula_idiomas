/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        military: {
          green: '#234d35',
          'green-dark': '#1a3a28',
          'green-light': '#2d5f42',
          gold: '#a8842c',
          'gold-light': '#c29b38',
          navy: '#1e2c3a',
        },
      },
    },
  },
  plugins: [],
};
