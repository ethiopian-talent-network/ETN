/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        etnNavy: "#003b5c", // Professional navy blue
        etnGreen: "#00a859", // Vibrant emerald green (Ethiopian flag green vibe)
        etnGold: "#fcd116", // Bright gold (Ethiopian flag yellow vibe)
        etnRed: "#ce1126", // Bold red (Ethiopian flag red vibe)
        etnBrown: "#5c4033", // Deep coffee brown
        etnLight: "#f4f7f6", // Light background
        etnCard: "#ffffff", // Card bg
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
