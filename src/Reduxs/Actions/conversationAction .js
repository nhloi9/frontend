import {message} from 'antd';
import {getApi, putApi} from '../../network/api';

import {conversationTypes} from '../Types/conversationType';
import {socket} from '../../socket';

export const getAllConversations = () => async (dispatch, getState) => {
	try {
		const res = await getApi('/conversations');
		dispatch({
			type: conversationTypes.GET_ALL_CONVERSATION_SUCCESS,
			payload: res.data.conversations,
		});
	} catch (error) {
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const addMessage = (message) => async (dispatch, getState) => {
	try {
		const conversationId = message.member?.conversationId;
		let conversation;
		const existConversation = getState().conversations.conversations?.find(
			(item) => item.id === conversationId
		);

		if (existConversation) {
			conversation = structuredClone(existConversation);
			conversation.lastMessage = message;
			conversation.updatedAt = new Date().toDateString();
			conversation.members?.forEach((item) => {
				if (item?.userId === message.member?.userId) {
					item.isSeen = true;
				} else item.isSeen = false;
			});
			// if (member) {
			// 	member.isSeen = true;
			// }
		} else {
			const res = await getApi('/conversations/' + conversationId);
			conversation = res.data?.conversation;
		}

		dispatch({
			type: conversationTypes.ADD_OR_UPDATE_CONVERSATION,
			payload: conversation,
		});
	} catch (error) {
		console.log(error);
	}
};

// export const seenConversationAction =()

export const seenConversation =
	(conversationId, userId, me) => async (dispatch, getState) => {
		try {
			if (me) {
				await putApi('/conversations/' + conversationId + '/seen');
				socket.emit('seenConversation', {
					conversationId,
				});
			}
			let conversation = getState().conversations?.conversations?.find(
				(item) => item.id === Number(conversationId)
			);
			if (conversation) {
				conversation = structuredClone(conversation);
				const member = conversation.members?.find(
					(item) => item?.userId === userId
				);
				if (member) {
					member.isSeen = true;
				}
				dispatch({
					type: conversationTypes.ADD_OR_UPDATE_CONVERSATION,
					payload: conversation,
				});
			}
		} catch (error) {}
	};
