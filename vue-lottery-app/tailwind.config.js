/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7CB9E8',
        'primary-hover': '#5A9BD5',
        'gray-light': '#F3F7FB',
        'gray-disabled': '#D1DCE6',
      },
    },
  },
  plugins: [],
}
