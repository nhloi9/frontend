// import i18next from 'i18next';

import {deleteApi, getApi, postApi, putApi} from '../../network/api';
import {socket} from '../../socket';
import {friendTypes} from '../Types/friendType';
import {globalTypes} from '../Types/globalType';

// export const getAllFriendsAction = () => async (dispatch, getState) => {
// 	try {
// 		const {
// 			data: {friends},
// 		} = await getApi('/friend-requests/friends');
// 		dispatch({type: friendTypes.FRIEND_GET_ALL_SUCCESS, payload: friends});
// 	} catch (error) {
// 		// dispatch({type: globleTypes.ALERT, payload: {loading: false}});
// 	}
// };

// export const getSendRequestsAction = () => async (dispatch, getState) => {
// 	try {
// 		const {
// 			data: {friends},
// 		} = await getApi('/friend-requests/send');
// 		dispatch({
// 			type: friendTypes.FRIEND_GET_SEND_REQUESTS_SUCCESS,
// 			payload: friends,
// 		});
// 	} catch (error) {
// 		// dispatch({type: globleTypes.ALERT, payload: {loading: false}});
// 	}
// };
// export const getReceiveRequestsAction = () => async (dispatch, getState) => {
// 	try {
// 		const {
// 			data: {friends},
// 		} = await getApi('/friend-requests/receive');
// 		dispatch({
// 			type: friendTypes.FRIEND_GET_RECEIVE_REQUESTS_SUCCESS,
// 			payload: friends,
// 		});
// 	} catch (error) {}
// };

export const getAllFriendRequestsAction = () => async (dispatch, getState) => {
	try {
		const {
			data: {requests},
		} = await getApi('/friend-requests');
		dispatch({
			type: friendTypes.FRIEND_GET_ALL_REQUESTS_SUCCESS,
			payload: requests,
		});
	} catch (error) {
		// dispatch({type: globleTypes.ALERT, payload: {loading: false}});
	}
};

export const friendCreateRequestAction =
	(receiverId) => async (dispatch, getState) => {
		try {
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: receiverId});
			const {
				data: {request},
			} = await postApi('/friend-requests/', {receiverId});
			dispatch({
				type: friendTypes.FRIEND_CREATE_REQUEST_SUCCSESS,
				payload: request,
			});
			socket.emit('addFriendRequest', request);
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		} catch (error) {
			dispatch({type: globalTypes.ALERT, payload: {error}});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		}
	};

export const friendUpdateRequestAction =
	(request) => async (dispatch, getState) => {
		try {
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: request?.id});
			await putApi('/friend-requests/' + request?.id);
			dispatch({
				type: friendTypes.FRIEND_UPDATE_REQUEST_SUCCSESS,
				payload: request?.id,
			});
			socket.emit('updateFriendRequest', {
				senderId: request?.senderId,
				receiverId: request.receiverId,
				id: request.id,
			});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		} catch (error) {
			dispatch({type: globalTypes.ALERT, payload: {error}});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		}
	};

export const friendDeleteRequestAction =
	(request) => async (dispatch, getState) => {
		try {
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: request?.id});
			await deleteApi('/friend-requests/' + request?.id);
			dispatch({
				type: friendTypes.FRIEND_DELETE_REQUEST_SUCCSESS,
				payload: request?.id,
			});
			socket.emit('deleteFriendRequest', {
				senderId: request?.senderId,
				receiverId: request.receiverId,
				id: request.id,
			});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		} catch (error) {
			dispatch({type: globalTypes.ALERT, payload: {error}});
			dispatch({type: friendTypes.FRIEND_BUTTON_LOADING, payload: false});
		}
	};
