/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        etnBlue: "#0085CA",
        etnGreen: "#10B981",
        etnBg: "#F8F9FB",
        etnDark: "#1F2937",
      },
    },
  },
  plugins: [],
};
