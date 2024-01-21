import {createReducer} from '@reduxjs/toolkit';
import {postTypes} from '../Types/postType';
import {updateToArray} from '../Types/globalType';

export const postReducer = createReducer(
	{posts: [], activePost: null},
	(builder) => {
		builder
			.addCase(postTypes.GET_HOME_POST_SUCCESS, (state, action) => {
				state.posts = action.payload;
			})
			.addCase(postTypes.POST, (state, action) => {
				state.posts = updateToArray(state.posts, action.payload);
			})
			.addCase(postTypes.UPDATE_POST, (state, action) => {
				state.posts = updateToArray(state.posts, action.payload);
			})
			.addCase(postTypes.POST_CREATE_SUCCESS, (state, action) => {
				state.posts = [action.payload, ...state.posts];
			})
			.addCase(postTypes.DELETE_POST, (state, action) => {
				state.posts = state.posts.filter((item) => item?.id !== action.payload);
			});
	}
);
