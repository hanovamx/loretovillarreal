/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Arimo"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['"Imperial Urw"', '"Times New Roman"', 'serif'],
      },
      colors: {
        primary: '#0f0f0f',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#0f0f0f',
          muted: '#6b7280',
        },
        bucket: {
          capture: '#6b7280',
          output: '#1f2937',
          selects: '#0f0f0f',
          trash: '#9f1239',
        },
        status: {
          programado: '#78350f',
          completado: '#0f0f0f',
          procesando: '#1f2937',
          entregado: '#111827',
        },
      },
      boxShadow: {
        subtle: '0 14px 32px -28px rgba(15, 15, 15, 0.65)',
      },
    },
  },
  plugins: [],
}

