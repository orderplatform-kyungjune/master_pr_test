// const plugin = require('tailwindcss/plugin')
// const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,ts}',
    '../../node_modules/vue-tailwind-datepicker/**/*.js',
  ],
  theme: {
    extend: {
      animation: {
        'infinite-bounce': 'infinite 5s linear 0s infinite',
        fadein: 'fadein 0.3s ease-in-out',
        fadeout: 'fadeout 0.3s ease-in-out',
        slidein: 'slidein 0.3s ease-in-out',
        slideout: 'slideout 0.3s ease-in-out',
        fadeup: 'fadeup 1.5s ease-in-out',
        'half-rotate': 'half-rotate 0.5s ease-in-out',
        'half-reverse-rotate': 'half-reverse-rotate 0.5s ease-in-out',
      },
      colors: {
        'vtd-primary': colors.gray,
        'vtd-secondary': colors.gray,
      },
      keyframes: {
        infinite: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(0, -20px)' },
          '50%': { transform: 'translate(0, -5px)' },
          '75%': { transform: 'translate(0, -15px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        'half-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(180deg)' },
        },
        'half-reverse-rotate': {
          '0%': { transform: 'rotate(180deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadein: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeout: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slidein: {
          '0%': { 'margin-top': '-0.78125vw' },
          '100%': { 'margin-top': '-0vw' },
        },
        slideout: {
          '0%': { 'margin-top': '0vw' },
          '100%': { 'margin-top': '-0.78125vw' },
        },
        fadeup: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.8)',
          },
          '10%': {
            opacity: 1,
            transform: 'scale(1) translateY(0)',
          },
          '90%': {
            opacity: 1,
            transform: 'scale(1) translateY(0)',
          },
          '100%': {
            opacity: 0,
            transform: 'scale(0.8)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar-hide'),
  ],
};
