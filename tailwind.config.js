/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "pa-gold": "#cda656",
        "pa-goldt": "rgba(205, 166, 86, 0.8)",
        "pa-dark": "#404040",
        "pa-darkt": "rgba(64, 64, 64, 0.8)",
      },
      fontFamily: {
        sans: ["Barlow", "sans-serif"],
      },
      // Preserving your specific grid layout structure
      gridTemplateColumns: {
        "pa-desktop": "3rem repeat(10, 1fr) 3rem",
        "pa-mobile": "1rem repeat(10, 1fr) 1rem",
      },
      gridTemplateRows: {
        "pa-desktop": "3rem repeat(10, 1fr) 3rem",
        "pa-mobile": "1rem repeat(10, 1fr) 1rem",
      },
    },
  },
  plugins: [],
};
