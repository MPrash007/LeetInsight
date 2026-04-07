/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                'lc-bg': '#0B0F19',
                'lc-card': '#151929',
                'lc-card-hover': '#1C2137',
                'lc-accent': '#7C5CFC',
                'lc-accent-hover': '#9B7FFF',
                'lc-easy': '#10B981',
                'lc-medium': '#F59E0B',
                'lc-hard': '#EF4444',
                'lc-text': '#FFFFFF',
                'lc-text-secondary': '#8B8FA3',
                'lc-border': '#1E2338',
                'lc-cyan': '#00D4FF',
                'lc-pink': '#E91E8C',
                'lc-orange': '#FF6B35',
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
