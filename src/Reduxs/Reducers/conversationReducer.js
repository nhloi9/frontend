import {createReducer} from '@reduxjs/toolkit';
import {storyTypes} from '../Types/storyType';
import {addOrUpdateToArray, updateToArray} from '../Types/globalType';
import {conversationTypes} from '../Types/conversationType';

export const conversationReducer = createReducer(
	{conversations: []},
	(builder) => {
		builder
			.addCase(conversationTypes.GET_ALL_CONVERSATION_SUCCESS, (state, action) => {
				state.conversations = action.payload;
			})
			.addCase(conversationTypes.DELTE, (state, action) => {
				state.conversations = state.conversations.filter(
					(item) => item?.id !== action.payload
				);
			})
			.addCase(conversationTypes.ADD_OR_UPDATE_CONVERSATION, (state, action) => {
				state.conversations = addOrUpdateToArray(
					state.conversations,
					action.payload
				);
			});
	}
);

// export const conversationReducer = createReducer(
// 	{conversations: []},
// 	(builder) => {
// 		builder.addCase(
// 			conversationTypes.GET_ALL_CONVERSATION_SUCCESS,
// 			(state, action) => {
// 				state.conversations = action.payload;
// 			}
// 		);
// 	}
// );
