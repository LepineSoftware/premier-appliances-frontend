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
      keyframes: {
        navSticky: {
          "0%": { position: "fixed", top: "-4rem", left: "0" },
          "80%": { position: "fixed", top: "0", left: "0" },
        },
        contactPopupActive: {
          "0%": { position: "fixed", top: "200%", left: "0" },
          "80%": { position: "fixed", top: "0", left: "0" },
        },
        swiperFade: {
          "0%": { opacity: "0" },
          "80%": { opacity: "1" },
        },
      },
      animation: {
        navSticky: "navSticky 0.5s ease-in-out",
        contactPopup: "contactPopupActive 0.5s ease-in-out",
        swiperFade: "swiperFade 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
};
