/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
	darkMode: 'class',
	corePlugins: {
		preflight: false,
	},
	content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Work Sans"', ...defaultTheme.fontFamily.sans],
				robo: ['"Roboto Condensed"', 'sans-serif'],
				rubik: ['"Rubik Doodle Shadow"', 'sans-serif'],
				sevil: ['"Sevillana"', 'sans-serif'],
			},
			colors: {
				dark: {
					100: '#242526',
					200: '#18191a',
				},
			},
		},
		// colors: {
		// 	dark: '##',
		// },
	},
	plugins: [],
};
