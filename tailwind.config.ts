import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a18072',
          700: '#977669',
          800: '#846358',
          900: '#43302b',
        },
        cream: {
          50: '#fffbf7',
          100: '#fef6e9',
          200: '#fcecd2',
          300: '#f9ddb3',
          400: '#f5ca8b',
          500: '#f0b05e',
          600: '#e69834',
          700: '#d07f23',
          800: '#a1621f',
          900: '#7e4f1e',
        },
        accent: {
          50: '#f5fbef',
          100: '#e9f6dd',
          200: '#d4eebb',
          300: '#b9e392',
          400: '#9ad467',
          500: '#7bc143',
          600: '#5fa033',
          700: '#4a802b',
          800: '#3d6627',
          900: '#345423',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')",
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
