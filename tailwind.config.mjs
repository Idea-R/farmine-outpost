/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        mine: {
          deep: '#1a1a2e',
          dark: '#16213e',
          stone: '#2d3436',
          shaft: '#0f0f1a',
        },
        copper: {
          DEFAULT: '#c97d3c',
          light: '#d4a456',
          dark: '#8b5a2b',
          glow: '#e8a849',
        },
        forge: {
          fire: '#e17055',
          ember: '#d63031',
          warm: '#fdcb6e',
        },
        gold: {
          DEFAULT: '#d4a456',
          bright: '#f0c040',
          dim: '#a07830',
        },
      },
      fontFamily: {
        heading: ['Cinzel', 'serif'],
        body: ['Source Code Pro', 'Menlo', 'monospace'],
        display: ['Cinzel Decorative', 'Cinzel', 'serif'],
      },
      backgroundImage: {
        'stone-texture': "url('/images/stone-bg.png')",
      },
    },
  },
  plugins: [],
};
