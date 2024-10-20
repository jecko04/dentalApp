/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./main/**/*.{js,jsx,ts,tsx}", // Watch all files in the main folder and subfolders
    "./App.{js,jsx,ts,tsx}",        // Include your main App file if it's outside the main folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

