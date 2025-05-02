/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdfcfd',
          100: '#f8f4f7',
          200: '#f0e9ef',
          300: '#e1d1dd',
          400: '#c08fb3',
          500: '#a06d95',
          600: '#772f6d',
          700: '#632756',
          800: '#4f1f44',
          900: '#3b1732',
          950: '#1f0c1a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.75',
            fontSize: '1rem',
            h1: {
              color: '#111827',
              fontWeight: '700',
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h2: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.875rem',
              lineHeight: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem',
            },
            h3: {
              color: '#111827',
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '2rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            code: {
              color: '#0ea5e9',
              backgroundColor: '#f1f5f9',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '500',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1f2937',
              color: '#f9fafb',
              borderRadius: '0.5rem',
              padding: '1rem',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0',
              borderRadius: '0',
            },
            blockquote: {
              borderLeftColor: '#0ea5e9',
              borderLeftWidth: '4px',
              fontStyle: 'italic',
              color: '#4b5563',
              backgroundColor: '#f8fafc',
              padding: '1rem',
              borderRadius: '0.25rem',
              margin: '1.5rem 0',
            },
            a: {
              color: '#0ea5e9',
              textDecoration: 'underline',
              textDecorationColor: '#bae6fd',
              textUnderlineOffset: '2px',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#0284c7',
                textDecorationColor: '#7dd3fc',
              },
            },
          },
        },
        invert: {
          css: {
            color: '#d1d5db',
            h1: { color: '#f9fafb' },
            h2: { color: '#f9fafb' },
            h3: { color: '#f9fafb' },
            code: {
              color: '#7dd3fc',
              backgroundColor: '#374151',
            },
            blockquote: {
              borderLeftColor: '#7dd3fc',
              color: '#d1d5db',
              backgroundColor: '#374151',
            },
            a: {
              color: '#7dd3fc',
              textDecorationColor: '#0284c7',
              '&:hover': {
                color: '#38bdf8',
                textDecorationColor: '#0ea5e9',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}