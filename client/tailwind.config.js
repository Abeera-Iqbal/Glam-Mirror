/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'glam-black': '#121212',
        'glam-dark': '#1a1a1a',
        'glam-pink': '#ffb7c5',
        'glam-hot': '#ff69b4',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}