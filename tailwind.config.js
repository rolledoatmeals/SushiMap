/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        salmon: '#E8735A',
        'salmon-light': '#F0A090',
        wasabi: '#7AB648',
        'wasabi-light': '#A8D070',
        'off-white': '#F8F4EF',
        charcoal: '#2C2926',
        'charcoal-mid': '#4A4440',
        'charcoal-light': '#8A7E78',
        surface: '#FFFFFF',
        'surface-warm': '#FDF9F5',
        border: '#EDE8E3',
        verified: '#2E7D32',
        pending: '#ED8C1E',
        error: '#C62828',
        'dark-bg': '#1A1714',
        'dark-surface': '#252220',
        'dark-border': '#3A3530',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};
