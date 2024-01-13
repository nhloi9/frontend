import {createReducer} from '@reduxjs/toolkit';
import {authTypes} from '../Types/authType';

const initialState = {
	user: null,
	isLogin: false,
};
export const authReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(authTypes.ALL, (state, action) => {
			state.isLogin = true;
			state.user = action.payload?.user;
			state.socketToken = action.payload?.socketToken;
		})
		.addCase(authTypes.USER, (state, action) => {
			state.user = action.payload?.user;
		})
		.addCase(authTypes.UPDATE_AVATAR_SUCCESS, (state, action) => {
			state.user = {...state.user, avatar: action.payload};
		})
		.addCase(authTypes.UPDATE_COVER_IMAGE_SUCCESS, (state, action) => {
			state.user = {
				...state.user,
				detail: {
					...(state.user.detail ?? {}),
					coverImage: action.payload,
				},
			};
		})
		.addCase(authTypes.SET_PASSWORD_SUCCESS, (state, action) => {
			state.user = {
				...state.user,
				password: undefined,
			};
		})
		.addCase(authTypes.LOGOUT_SUCCESS, (state, action) => ({}));
});
