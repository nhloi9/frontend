import {getApi, postApi} from '../../network/api';
import {globalTypes} from '../Types/globalType';
import {groupTypes} from '../Types/groupType';

export const createGroupAction =
	(name, privacy, invites) => async (dispatch, getState) => {
		dispatch({
			type: globalTypes.ALERT,
			payload: {
				loading: true,
			},
		});
		try {
			const {
				data: {group},
			} = await postApi('/groups', {
				name,
				privacy,
				invites,
			});
			dispatch({
				type: groupTypes.CREATE_GROUP_SUCCESS,
				payload: group,
				// payload: res.data.stories,
			});
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					loading: false,
				},
			});
		} catch (error) {
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					error: error,
				},
			});
			// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		}
	};

export const GroupInvite = (groupId, invites) => async (dispatch, getState) => {
	try {
		dispatch({type: globalTypes.ALERT, payload: {loading: true}});
		await postApi('groups/requests/invite', {groupId, invites});
		dispatch({
			type: globalTypes.ALERT,
			payload: {success: 'Invite friend success'},
		});
	} catch (error) {
		dispatch({type: globalTypes.ALERT, payload: {error}});
	}
};

export const memberInvite =
	(groupId, invites) => async (dispatch, getState) => {
		try {
			dispatch({type: globalTypes.ALERT, payload: {loading: true}});
			await postApi('groups/invite', {groupId, invites});
			dispatch({
				type: globalTypes.ALERT,
				payload: {success: 'Invite friend success'},
			});
		} catch (error) {
			dispatch({type: globalTypes.ALERT, payload: {error}});
		}
	};

export const getAllGroupRequestsOfUser = () => async (dispatch, getState) => {
	try {
		const {
			data: {requests},
		} = await getApi('/groups/requests');

		dispatch({
			type: groupTypes.GET_GROUP_REQUESTS_SUCCESS,
			payload: requests,
		});
	} catch (error) {}
};

export const getAllOwnGroupOfUser = () => async (dispatch, getState) => {
	try {
		const {
			data: {groups},
		} = await getApi('/groups/own');

		dispatch({
			type: groupTypes.GET_OWN_GROUPS_SUCCESS,
			payload: groups,
		});
	} catch (error) {}
};
