/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'theme-primary': '#23356f',
        'theme-secondary': '#00e5db',
        'theme-accent1': '#7bd8d0',
        'theme-accent2': '#079baa',
        'theme-dark': '#1a2269',
        'vision': '#ff8f00',
        'effort': '#86b4f0',
        'systems': '#72cb44',
        'practice': '#7f31a4',
        'attitude': '#f032e6',
      }
    },
  },
  plugins: [],
}; 