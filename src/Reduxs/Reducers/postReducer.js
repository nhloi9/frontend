import {createReducer} from '@reduxjs/toolkit';
import {postTypes} from '../Types/postType';
import {addOrUpdateToArray, updateToArray} from '../Types/globalType';

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
			.addCase(postTypes.POST_CREATE_SUCCESS, (state, action) => {
				state.posts = [action.payload, ...state.posts];
			});
	}
);

// export const friendAddReducer = createReducer({}, (builder) => {
// 	builder
// 		.addCase(friendTypes.FRIEND_ADD_REQUEST, (state, action) => {
// 			state.isLoading = true;
// 		})
// 		.addCase(friendTypes.FRIEND_ADD_SUCCESS, (state, action) => {
// 			state.isLoading = false;
// 		})
// 		.addCase(friendTypes.FRIEND_ADD_FAIL, (state, action) => {
// 			state.isLoading = false;
// 		});
// });

// export const friendRemoveReducer = createReducer({}, (builder) => {
// 	builder
// 		.addCase(friendTypes.FRIEND_REMOVE_REQUEST, (state, action) => {
// 			state.isLoading = true;
// 		})
// 		.addCase(friendTypes.FRIEND_REMOVE_SUCCESS, (state, action) => {
// 			state.isLoading = false;
// 			state.isSuccess = true;
// 		})
// 		.addCase(friendTypes.FRIEND_REMOVE_FAIL, (state, action) => {
// 			state.isLoading = false;
// 			state.isError = action.payload;
// 		})
// 		.addCase(friendTypes.FRIEND_REMOVE_RESET, (state, action) => {
// 			state.isSuccess = null;
// 			state.isError = null;
// 		});
// });
