/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        salmon: '#E8553E',
        wasabi: '#4CAF7A',
        offwhite: '#F5EFE0',
        charcoal: '#1A1A1A',
        openGreen: '#4CAF7A',
        closedRed: '#E85555',

        // Light theme surfaces (default)
        surface: '#FFFFFF',
        surface2: '#F5F5F0',
        border: '#E8E8E3',
        textPrimary: '#1A1A1A',
        textSecondary: '#6B6B6B',
        textTertiary: '#ABABAB',
      },
    },
  },
  plugins: [],
};
