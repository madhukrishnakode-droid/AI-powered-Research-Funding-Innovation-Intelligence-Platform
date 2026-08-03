/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
        'accent-gradient': 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
        'page-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0F172A 0%, #2563EB 55%, #06B6D4 100%)',
      },
      boxShadow: {
        card: '0 8px 30px rgba(2,6,23,0.35)',
        'glow-blue': '0 8px 30px rgba(37,99,235,0.35)',
        'glow-purple': '0 8px 30px rgba(124,58,237,0.35)',
        'glow-teal': '0 8px 30px rgba(20,184,166,0.35)',
      },
    },
  },
  plugins: [],
}
