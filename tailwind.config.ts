import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          50: '#f0f4ff',
          100: '#e6ecff',
          200: '#c7d9ff',
          300: '#a8c5ff',
          400: '#7da8ff',
          500: '#4f46e5',
          600: '#4f46e5',
          700: '#3730a3',
          800: '#2d20aa',
          900: '#1f1454',
        },
        'bg': {
          'light': '#ffffff',
          'dark': '#0a0e27',
          'darkSecond': '#0f1629',
          'darkTertiary': '#1a1f3a',
        },
        'text': {
          'light': '#1f2937',
          'lightSecond': '#6b7280',
          'dark': '#f3f4f6',
          'darkSecond': '#d1d5db',
        },
        'border': {
          'light': '#e5e7eb',
          'dark': '#374151',
        },
      },
      fontFamily: {
        'sora': 'var(--font-sora)',
        'dm-sans': 'var(--font-dm-sans)',
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
    },
  },
  plugins: [],
}
export default config
