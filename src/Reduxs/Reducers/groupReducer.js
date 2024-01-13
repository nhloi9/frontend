import {createReducer} from '@reduxjs/toolkit';
import {groupTypes} from '../Types/groupType';
import {updateToArray} from '../Types/globalType';

export const groupReducer = createReducer(
	{requests: [], ownGroups: []},
	(builder) => {
		builder
			// .addCase(groupTypes.CREATE_GROUP_SUCCESS, (state, action) => {
			// 	state.success = true;
			// 	state.groupId = action.payload;
			// })

			// .addCase(groupTypes.CREATE_GROUP_RESET, (state, action) => {
			// 	return {};
			// });
			.addCase(groupTypes.GET_GROUP_REQUESTS_SUCCESS, (state, action) => {
				state.requests = action.payload;
			})
			.addCase(groupTypes.GET_OWN_GROUPS_SUCCESS, (state, action) => {
				state.ownGroups = action.payload;
			})
			.addCase(groupTypes.CREATE_REQUEST, (state, action) => {
				state.requests = [...state.requests, action.payload];
			})
			.addCase(groupTypes.DELETE_REQUEST, (state, action) => {
				state.requests = state.requests?.filter(
					(req) => req?.id !== action.payload
				);
			})

			.addCase(groupTypes.UPDATE_REQUEST, (state, action) => {
				const request = state.requests?.find((req) => req?.id === action.payload);
				if (request) {
					request.status = 'accepted';
				}
			});
	}
);

export const createGroupReducer = createReducer({}, (builder) => {
	builder
		.addCase(groupTypes.CREATE_GROUP_SUCCESS, (state, action) => {
			state.success = true;
			state.groupId = action.payload?.id;
		})

		.addCase(groupTypes.CREATE_GROUP_RESET, (state, action) => {
			return {};
		});
});
