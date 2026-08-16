/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F7F2',
        ink: '#17201E',
        muted: '#65706D',
        line: '#DDE2DC',
        accent: '#1F6E62',
        'accent-dark': '#18584F',
        sage: '#DCE9E3',
      },
      boxShadow: {
        card: '0 18px 50px -30px rgba(23, 32, 30, 0.35)',
        lift: '0 24px 60px -28px rgba(23, 32, 30, 0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'Aptos', 'Segoe UI', 'sans-serif'],
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
