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
        // Primary palette - monochromatic (from ecommerce-react)
        primary: '#101010',
        'primary-hover': '#2a2a2a',

        // Backgrounds
        body: '#f9f9f9',
        'body-alt': '#f2f2f2',
        surface: '#ffffff',

        // Text
        heading: '#1a1a1a',
        paragraph: '#4a4a4a',

        // Borders
        border: '#e1e1e1',
        'border-focus': '#c5c5c5',

        // Subtle text (secondary/muted)
        subtle: '#818181',

        // Grays
        'gray-01': '#3a3a3a',
        'gray-10': '#818181',
        'gray-20': '#b6b6b6',
        'off-black': '#303030',
        'off-white': '#f0f0f0',

        // Navigation
        'nav-bg': '#f8f8f8',
        'nav-bg-scrolled': '#ffffff',

        // Semantic
        success: '#3b9620',
        danger: 'rgba(247, 45, 45, 0.986)',
        warning: 'rgb(228, 165, 31)',

        // Admin UI
        'admin-bg': '#F5F7FA',
        'admin-sidebar': '#ffffff',
        'admin-active': '#E8F4FE',
        'admin-active-text': '#1A8FE3',
        'admin-active-border': '#1A8FE3',
        'admin-muted': '#8A94A6',
        'admin-nav-text': '#3F4254',

        // Social
        facebook: '#0078ff',
        github: '#24292e',
      },
      fontFamily: {
        sans: ['var(--font-tajawal)', 'Helvetica', 'Arial', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '800px',
        'lg': '1024px',
        'xl': '1280px',
        'desktop': '1520px',
        'l-desktop': '1632px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'scale-in': 'scaleIn 0.3s ease forwards',
        'spin-slow': 'spin 1s linear infinite',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'slide-out-right': 'slideOutRight 0.5s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'slide-in-toast': 'slideInToast 0.3s ease forwards',
        'full-width': 'fullWidth 3s linear forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'translate(-50%, -50%) scale(0)' },
          '100%': { transform: 'translate(-50%, -50%) scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInToast: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fullWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      transitionTimingFunction: {
        'bezier': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      spacing: {
        'nav': '6rem',
        'nav-tall': '100px',
        'content-top': '10rem',
        'content-top-mobile': '8.5rem',
      },
      zIndex: {
        'toast': '100',
        'modal': '80',
        'basket': '60',
        'navigation': '55',
        'filter': '40',
        'search': '30',
        'content': '10',
      },
    },
  },
  plugins: [],
};

export default config;
