import {createReducer} from '@reduxjs/toolkit';
import {notifyTypes} from '../Types/notifyType';
console.log({object: localStorage.getItem('sound')});
const initialState = {
	notifies: [],
	sound:
		localStorage.getItem('sound') &&
		JSON.parse(localStorage.getItem('sound')) === true
			? true
			: false,
	push:
		Notification.permission === 'granted' &&
		localStorage.getItem('notify_push') &&
		JSON.parse(localStorage.getItem('notify_push')) === true
			? true
			: false,
};

export const notifyReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(notifyTypes.GET_ALL_NOTIFIES_SUCCESS, (state, action) => {
			state.notifies = action.payload;
		})
		.addCase(notifyTypes.READ_NOTIFY_SUCCESS, (state, action) => {
			const notify = state.notifies.find((item) => item.id === action.payload);
			notify.isSeen = true;
		})
		.addCase(notifyTypes.NOTIFY_SOUND, (state, action) => {
			state.sound = action.payload;
		})
		.addCase(notifyTypes.NOTIFY_PUSH, (state, action) => {
			state.push = action.payload;
		})
		.addCase(notifyTypes.ADD_NOTIFY, (state, action) => {
			state.notifies = [action.payload, ...state.notifies];
		});
});
