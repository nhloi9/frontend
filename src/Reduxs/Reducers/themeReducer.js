import {createReducer} from '@reduxjs/toolkit';
import {themeTypes} from '../Types/themeType';

const themes = ['dark', 'light'];
let initialState;

if (
	localStorage.getItem('theme') === 'dark' ||
	(!('theme' in localStorage) &&
		window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
	initialState = 'dark';
} else initialState = 'light';

export const themeReducer = createReducer(initialState, (builder) => {
	builder.addCase(themeTypes.THEME_CHANGE, (state, action) => {
		return themes.find((theme) => theme !== state);
	});
});
