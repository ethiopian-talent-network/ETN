/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        etnIndigo: "#4F46E5",
        etnViolet: "#7C3AED",
        etnDark: "#111827",
        etnBg: "#F3F4F6",
      },
    },
  },
  plugins: [],
}
