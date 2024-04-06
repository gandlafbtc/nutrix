/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
		themes: [
			{
				default: {
					//Theme Colors https://daisyui.com/docs/colors/
					primary: '#00CC00',
					'primary-content': '#23313c',
					secondary: '#eb9c41',
					'secondary-content': '#23313c',
					accent: '#ffbf45',
					'accent-content': '#000000',
					neutral: '#ffffff',
					'neutral-content': '#23313c',
					'base-100': '#90a0ac',
					'base-200': '#5b7388',
					'base-300': '#182a3c',
					'base-content': '#ffffff',
					info: '#0ea5e9',
					'info-content': '#000000',
					success: '#63eb81',
					'success-content': '#000000',
					warning: '#ffbf45',
					'warning-content': '#000000',
					error: '#FD4337',
					'error-content': '#000000',

					// Theme Variables https://daisyui.com/docs/utilities/#-3
					'--rounded-box': '0rem', // border radius rounded-box utility class, used in card and other large boxes
					'--rounded-btn': '0rem', // border radius rounded-btn utility class, used in buttons and similar element
					'--rounded-badge': '0rem', // border radius rounded-badge utility class, used in badges and similar
					'--animation-btn': '0.25s', // duration of animation when you click on button
					'--animation-input': '0.2s', // duration of animation for inputs like checkbox, toggle, radio, etc
					'--btn-focus-scale': '0.95', // scale transform of button when you focus on it
					'--border-btn': '0px', // border width of buttons
					'--tab-border': '0px', // border width of tabs
					'--tab-radius': '0rem' // border radius of tabs
				}
			},

		]
	},
}

