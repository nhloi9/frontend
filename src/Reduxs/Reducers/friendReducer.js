import {createReducer} from '@reduxjs/toolkit';
import {friendTypes} from '../Types/friendType';
import {authTypes} from '../Types/authType';

const initialState = {
	requests: [],
	// friends: [],
	// sendRequests: [],
	// receiveRequests: [],
	isLoading: false,
};
export const friendReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(friendTypes.FRIEND_GET_ALL_REQUESTS_SUCCESS, (state, action) => {
			state.requests = action.payload;
		})
		.addCase(friendTypes.FRIEND_CREATE_REQUEST_SUCCSESS, (state, action) => {
			state.requests = [action.payload, ...state.requests];
		})
		.addCase(friendTypes.FRIEND_DELETE_REQUEST_SUCCSESS, (state, action) => {
			state.requests = state.requests?.filter((req) => req.id !== action.payload);
		})
		.addCase(friendTypes.FRIEND_UPDATE_REQUEST_SUCCSESS, (state, action) => {
			const request = state.requests?.find((req) => req.id === action.payload);
			if (request) {
				request.status = 'accepted';
			}
		})
		// .addCase(friendTypes.FRIEND_GET_ALL_SUCCESS, (state, action) => {
		// 	state.friends = action.payload;
		// })
		// .addCase(friendTypes.FRIEND_GET_RECEIVE_REQUESTS_SUCCESS, (state, action) => {
		// 	state.receiveRequests = action.payload;
		// })
		// .addCase(friendTypes.FRIEND_GET_SEND_REQUESTS_SUCCESS, (state, action) => {
		// 	state.sendRequests = action.payload;
		// })

		.addCase(friendTypes.FRIEND_BUTTON_LOADING, (state, action) => {
			state.isLoading = action.payload;
		})
		.addCase(authTypes.LOGOUT_SUCCESS, (state, action) => ({
			friends: [],
			requests: [],
			sendRequests: [],
			receiveRequests: [],
			isLoading: false,
		}));
});
