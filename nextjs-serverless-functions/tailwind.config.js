module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      primary: "#2b189b",
      secondary: "#006654",
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
  plugins: [],
};
