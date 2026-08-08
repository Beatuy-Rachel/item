/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F9F5EE',
          200: '#F0E9DA',
          300: '#E5DAC3',
          400: '#D4C59F',
        },
        forest: {
          50: '#EEF2EF',
          100: '#D8E1DA',
          200: '#B3C4B8',
          300: '#87A08F',
          400: '#5E8069',
          500: '#3D6149',
          600: '#2D4A37',
          700: '#1F3527',
          800: '#15261B',
          900: '#0E1A12',
        },
        ink: {
          50: '#F7F6F2',
          100: '#E9E7DF',
          200: '#D5D2C5',
          300: '#B8B4A3',
          400: '#8E8A7A',
          500: '#6B685A',
          600: '#535046',
          700: '#3D3B34',
          800: '#2A2924',
          900: '#1A1916',
        },
      },
      fontFamily: {
        sans: [
          'HarmonyOS Sans',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      borderRadius: {
        'card': '16px',
      },
    },
  },
  plugins: [],
};
