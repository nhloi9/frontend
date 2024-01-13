import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './Reducers/authReducer';
import {alertReducer} from './Reducers/alertReducer';
import {themeReducer} from './Reducers/themeReducer';
import {friendReducer} from './Reducers/friendReducer';
import {homePostReducer, postReducer} from './Reducers/postReducer';
import {storyReducer} from './Reducers/storyReducer';
import {createGroupReducer, groupReducer} from './Reducers/groupReducer';
import {notifyReducer} from './Reducers/notifyReducer';
import {conversationReducer} from './Reducers/conversationReducer';
import {socketMiddleware} from './Middleware/socket';
import {socket} from '../socket';
import {onlineReducer} from './Reducers/onlineReducer';
import {callReducer} from './Reducers/callReducer';
import {postSaveReducer} from './Reducers/postSaveReducer';
// import {signinReducer} from './Reducers/signinReducer';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		alert: alertReducer,
		theme: themeReducer,
		friend: friendReducer,
		post: postReducer,
		stories: storyReducer,
		group: groupReducer,
		createGroup: createGroupReducer,
		notifies: notifyReducer,
		conversations: conversationReducer,
		onlines: onlineReducer,
		call: callReducer,
		save: postSaveReducer,

		// signin: signinReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(socketMiddleware(socket)),
});
// const combinedReducer = combineReducers({
// 	auth: authReducer,
// 	alert: alertReducer,
// 	theme: themeReducer,
// 	friend: friendReducer,
// });

// export const store = configureStore({
// 	reducer: (state, action) => {
// 		if (action.type === authTypes.LOGOUT_SUCCESS) {
// 			// check for action type
// 			state = {};
// 		}
// 		return combinedReducer(state, action);
// 	},
// });
