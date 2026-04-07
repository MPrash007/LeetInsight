/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                'lc-bg': '#0F0F0F',
                'lc-card': '#1A1A1A',
                'lc-card-hover': '#242424',
                'lc-accent': '#FFA116',
                'lc-accent-hover': '#FFB84D',
                'lc-easy': '#00B8A3',
                'lc-medium': '#FFC01E',
                'lc-hard': '#FF375F',
                'lc-text': '#FFFFFF',
                'lc-text-secondary': '#B3B3B3',
                'lc-border': '#2A2A2A',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
