/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#243c5a",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate")],
};
