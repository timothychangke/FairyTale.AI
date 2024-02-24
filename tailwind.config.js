/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'text-animation', 
    'text-animation-container'
  ],
  theme: {
    extend: {
      fontFamily: { 
        "MaShanZheng": ['MaShanZheng', 'sans-serif'] 
    } 
    },
  },
  plugins: [],
}
