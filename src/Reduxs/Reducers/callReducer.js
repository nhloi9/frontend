import {createReducer} from '@reduxjs/toolkit';
import {callTypes} from '../Types/callType';

const initialState = null;
export const callReducer = createReducer(initialState, (builder) => {
	builder.addCase(callTypes.CALL, (state, action) => {
		return action.payload;
	});
});
