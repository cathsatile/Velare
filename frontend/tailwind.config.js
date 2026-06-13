/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        velare: {
          bg: '#0F0E0E',
          'bg-alt': '#1A1614',
          panel: '#1F1C1A',
          border: '#2E2A27',
          gold: '#C9A84C',
          'gold-light': '#E2C06A',
          text: '#F5F0E8',
          'text-muted': '#9E8E79',
          success: '#4CAF7D',
          error: '#E05C5C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
