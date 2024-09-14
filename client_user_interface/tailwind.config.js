/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'Gelion', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      screens: {
        // Custom breakpoints
        'laptop': '1024px',
        'tablet': '640px',
        'mobile': '320px', // Example breakpoint for very small screens
      },
    },
  },
  plugins: [],
}
