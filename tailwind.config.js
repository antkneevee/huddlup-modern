/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enables dark mode via class on <html>
  theme: {
  screens: {
    xs: '400px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
    extend: {
      colors: {
        primary: '#00BFA6',
        secondary: '#374151',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        neutralLight: '#F9FAFB',
        neutralDark: '#111827',
      },
    },
  },
  plugins: [],
};
