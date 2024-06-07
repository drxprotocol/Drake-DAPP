/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            width: {
                78: '19.5rem',
                90: '23.5rem',
                100: '25rem',
                default: '73.5rem',
                '60rem': '60rem',
            },
            space: {},
            maxWidth: {
                default: '73.5rem',
            },
            borderRadius: {
                '32px': '32px',
                '20px': '20px',
            },
            colors: {
                'primary-black': '#1B2022',
                primary: '#31C1BF',
                'primary-hover': '#3ab1ab',
                'primary-blue': '#2D9CDB',
                'primary-gray': '#707E85',
                'primary-dark': '#1B2022',
                'secondary-gray': '#404B51',
                discord: '#4860B9',
                'text-gray1': '#1B2022',
                'bg-gray': '#F8FAFA',
                'primary-border': '#E7ECEF',
                'primary-border-2': '#C8CFD3',
                'light-yellow': '#FFFACF',
                'dark-yellow': '#FFB400',
                'dark-blue': '#2783B8',
                green1: '#09A57F',
            },
            fontFamily: {
                sbold: 'Switzer-Semibold',
                smedium: 'Switzer-Regular',
                sansBold: 'Switzer-Bold',
            },
        },
    },
    plugins: [],
};
