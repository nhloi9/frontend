import {getApi, putApi} from '../../network/api';

import {notifyTypes} from '../Types/notifyType';

export const getAllNotifiesAction = () => async (dispatch, getState) => {
	try {
		const res = await getApi('/notifies');
		dispatch({
			type: notifyTypes.GET_ALL_NOTIFIES_SUCCESS,
			payload: res?.data?.notifies,
		});
	} catch (error) {
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const readNotifyAction = (notifyId) => async (dispatch, getState) => {
	try {
		await putApi('/notifies/' + notifyId + '/read');
		dispatch({
			type: notifyTypes.READ_NOTIFY_SUCCESS,
			payload: notifyId,
		});
	} catch (error) {
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};
