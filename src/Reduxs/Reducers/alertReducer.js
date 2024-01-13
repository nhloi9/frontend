import {createReducer} from '@reduxjs/toolkit';
import {globalTypes} from '../Types/globalType';
import {authTypes} from '../Types/authType';

const initialState = {loading: true};
export const alertReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(globalTypes.ALERT, (state, action) => {
			return action.payload;
		})
		.addCase(authTypes.LOGOUT_SUCCESS, (state, action) => ({}));
});
