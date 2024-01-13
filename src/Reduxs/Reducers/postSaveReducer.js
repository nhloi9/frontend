import {createReducer} from '@reduxjs/toolkit';

import {postTypes} from '../Types/postType';

export const postSaveReducer = createReducer([], (builder) => {
	builder
		.addCase(postTypes.GET_SAVE_POSTS_SUCCESS, (state, action) => {
			return action.payload;
		})
		.addCase(postTypes.SAVE_POST, (state, action) => {
			return [action.payload, ...state];
		})
		.addCase(postTypes.UN_SAVE_POST, (state, action) => {
			return state.filter((item) => item.id !== action.payload);
		});
});
