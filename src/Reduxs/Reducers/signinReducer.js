import {createReducer} from '@reduxjs/toolkit';
import {authTypes} from '../Types/authType';

const initialState = {};
export const signinReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(authTypes.SIGNIN_SUCCESS, (state, action) => {
			state.isSuccess = action.payload;
		})
		.addCase(authTypes.SIGNIN_FAIL, (state, action) => {
			state.isError = action.payload;
		});
});
