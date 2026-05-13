/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui'],
      },
      animation: {
        'marquee': 'marqueeSmooth 10s linear infinite',
        'wave': 'waveDynamic 1.2s ease-in-out infinite',
      },
      keyframes: {
        marqueeSmooth: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-32%)' },
        },
        waveDynamic: {
          '0%, 100%': { transform: 'scaleY(0.55)', opacity: '0.6' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
