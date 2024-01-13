import {createReducer} from '@reduxjs/toolkit';
import {onlineTypes} from '../Types/onlineType';

export const onlineReducer = createReducer([], (builder) => {
	builder
		.addCase(onlineTypes.ONLINE_USERS, (state, action) => {
			return action.payload;
		})
		.addCase(onlineTypes.OFFLINE, (state, action) => {
			return state.filter((item) => item !== action.payload);
		})
		.addCase(onlineTypes.ONLINE, (state, action) => {
			return [...state, action.payload];
		});
});
