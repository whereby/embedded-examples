const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      white: colors.white,
      gray: colors.coolGray,
      primary: "#2b189b",
      secondary: "#006654",
      negative: "#c35037",
    },
    fontFamily: {
      headline: ["Whereby Text", "Georgia", "serif"],
      "sub-headline": ["Whereby Condensed", "Georgia", "serif"],
      text: ["Inter", "sans-serif"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
