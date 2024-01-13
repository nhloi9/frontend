import {createReducer} from '@reduxjs/toolkit';
import {storyTypes} from '../Types/storyType';
import {addOrUpdateToArray, updateToArray} from '../Types/globalType';

export const storyReducer = createReducer({stories: []}, (builder) => {
	builder
		.addCase(storyTypes.GET_HOME_STORIES_SUCCESS, (state, action) => {
			state.stories = action.payload;
		})
		.addCase(storyTypes.COMMENT_STORY_SUCCESS, (state, action) => {
			state.stories = updateToArray(state.stories, action.payload);
		})
		.addCase(storyTypes.REACT_STORY_SUCCESS, (state, action) => {
			state.stories = updateToArray(state.stories, action.payload);
		})
		.addCase(storyTypes.CREATE_STORY_SUCCESS, (state, action) => {
			state.stories = [action.payload, ...state.stories];
		})
		.addCase(storyTypes.STORY_PROFILE, (state, action) => {
			state.type = action.payload;
		});
});
