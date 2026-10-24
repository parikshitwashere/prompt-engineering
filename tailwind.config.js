/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171923',
        muted: '#6B7280',
        line: '#E8EAF2',
        paper: '#F7F8FC',
        violet: '#5B5CE2',
        lilac: '#A5A6F6',
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      boxShadow: {
        soft: '0 12px 34px rgba(28, 31, 55, .07)',
        card: '0 8px 24px rgba(27, 34, 74, .06)',
      },
      borderRadius: { '4xl': '2rem' },
    },
  },
  plugins: [],
};
