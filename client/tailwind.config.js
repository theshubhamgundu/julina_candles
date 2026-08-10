/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f5133",
        primaryDark: "#163b26",
        primaryMid: "#2f7d43",
        secondary: "#c4633c",
        tertiary: "#f7f4ec",
        cream: "#f7f4ec",
        cream2: "#efe9db",
        ink: "#24291f",
        muted: "#5f6455",
      },
      fontFamily: {
        sans: ['"Geist"', '"Inter"', 'system-ui', 'sans-serif'],
        ui: ['"Geist"', '"Inter"', 'sans-serif'],
        headline: ['"Roboto Flex"', 'sans-serif'],
        display: ['"Roboto Flex"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
        accent: ['"Instrument Serif"', 'serif'],
        price: ['"Roboto Flex"', 'sans-serif'],
        mono: ['"Roboto Flex"', 'monospace'],
      },
    },
  },
  plugins: [],
}

