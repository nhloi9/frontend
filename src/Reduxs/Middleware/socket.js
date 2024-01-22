import {addMessage, seenConversation} from '../Actions/conversationAction ';
import {notifyTypes} from '../Types/notifyType';
import {friendTypes} from '../Types/friendType';
import {onlineTypes} from '../Types/onlineType';
import {callTypes} from '../Types/callType';
import toast from 'react-hot-toast';
import {postTypes} from '../Types/postType';
import {defaulAvatar} from '../../Constants';

function spawnNotification(body, icon, title, url) {
	const notification = new Notification(title, {body, icon});
	notification.onclick = (e) => {
		e.preventDefault();
		window.open(url, '_blank');
	};
}

export const socketMiddleware = (socket) => (params) => (next) => (action) => {
	const {dispatch, getState} = params;
	const {type, payload} = action;

	switch (type) {
		case 'socket/connect':
			socket.connect(getState().auth?.socketToken);

			socket.on('onlineUsers', (payload) => {
				dispatch({type: onlineTypes.ONLINE_USERS, payload});
			});

			socket.on('online', (userId) => {
				dispatch({type: onlineTypes.ONLINE, payload: userId});
			});
			socket.on('offline', (userId) => {
				dispatch({type: onlineTypes.OFFLINE, payload: userId});
			});

			// socket.connect();
			// socket.on('connect', () => {
			// 	//join_post
			// 	socket.emit(
			// 		'join_post',
			// 		getState().homePost.posts.map((post) => post._id)
			// 	);

			// 	//join user
			// 	socket.emit(
			// 		'join_user',
			// 		getState().auth.user._id,
			// 		getState().auth.user.followers.map((follower) => follower._id)
			// 	);
			// });

			//check online
			// console.log(getState().friend);
			// const friendsId = getState().friend.friends.map((friend) => friend.id);

			// socket.emit('check_online', friendsId);
			// socket.on('check_online', (list) => {
			// 	// dispatch({type: GLOBALTYPES.ONLINE, payload: list});
			// });

			//receive offline
			// socket.on('offline', (user) => {
			// 	dispatch({type: GLOBALTYPES.OFFLINE, payload: user});
			// });

			//receive comment
			// socket.on('comment', (comment) => {
			// 	dispatch(receiveComment(comment));
			// });

			//receive like post
			// socket.on('like', (like) => {
			// 	const post = getState().homePost.posts.find(
			// 		(post) => post._id === like.post
			// 	);
			// 	dispatch({
			// 		type: POST_TYPES.UPDATE_POST,
			// 		payload: {...post, likes: [...post.likes, like]},
			// 	});
			// });

			//receive unlike post
			// socket.on('unlike', (postId, userId) => {
			// 	const post = getState().homePost.posts.find((post) => post._id === postId);
			// 	dispatch({
			// 		type: POST_TYPES.UPDATE_POST,
			// 		payload: {
			// 			...post,
			// 			likes: post.likes.filter((like) => like.user._id !== userId),
			// 		},
			// 	});
			// });

			//receive follow
			// socket.on('follow', (sender) => {
			// 	const user = getState().auth.user;
			// 	dispatch({
			// 		type: GLOBALTYPES.USER,
			// 		payload: {...user, followers: addToArray(user.followers, sender)},
			// 	});
			// });

			//receive unfollow
			// socket.on('unfollow', (senderId) => {
			// 	const user = getState().auth.user;
			// 	dispatch({
			// 		type: GLOBALTYPES.USER,
			// 		payload: {
			// 			...user,
			// 			followers: removeFromArray(user.followers, {_id: senderId}),
			// 		},
			// 	});
			// });

			// receive notify
			socket.on('notify', (notify) => {
				const {sound, push} = getState().notifies;
				if (push) {
					spawnNotification(
						notify.content
							? notify.content?.length > 20
								? notify.content.slice(0, 20) + '...'
								: notify.content
							: '',
						notify?.sender?.avatar?.url ?? defaulAvatar,
						(notify.sender?.firstname ?? '') +
							' ' +
							(notify.sender?.lastname ?? '') +
							' ' +
							notify.text,
						notify.url
					);
				}
				if (sound) {
					document
						.getElementById('notification_sound')
						?.play()
						?.catch((err) => {
							console.log(err);
						});
				}
				dispatch({type: notifyTypes.ADD_NOTIFY, payload: notify});
				// if (getState().notify.sound) {
				// 	document.getElementById('notification_sound').play();
				// }
			});

			socket.on('addFriendRequest', (request) => {
				dispatch({
					type: friendTypes.FRIEND_CREATE_REQUEST_SUCCSESS,
					payload: request,
				});
			});

			socket.on('deleteFriendRequest', (requestId) => {
				dispatch({
					type: friendTypes.FRIEND_DELETE_REQUEST_SUCCSESS,
					payload: requestId,
				});
			});

			socket.on('updateFriendRequest', (requestId) => {
				dispatch({
					type: friendTypes.FRIEND_UPDATE_REQUEST_SUCCSESS,
					payload: requestId,
				});
			});

			// receive delete nofify by sender
			// socket.on('deleteBySender', (notify) => {
			// 	dispatch({type: NOTIFY_TYPES.DELETEBYSENDER, payload: notify});
			// });

			//receive message
			socket.on('addMessage', ({message}) => {
				dispatch(addMessage(message));
			});

			//receive seen message
			socket.on('seenConversation', (userId, conversationId) => {
				dispatch(seenConversation(conversationId, userId));
			});

			socket.on('call', (payload) => {
				if (!getState().call) {
					dispatch({
						type: callTypes.CALL,
						payload: payload,
					});
				}
			});

			socket.on('meBusy', () => {
				dispatch({type: callTypes.CALL, payload: null});
				toast.error('you are on  call');
			});

			socket.on('otherOffline', () => {
				dispatch({type: callTypes.CALL, payload: null});
				toast.error('All members are offline');
			});

			socket.on('otherBusy', () => {
				dispatch({type: callTypes.CALL, payload: null});
				toast.error('All members are busy');
			});

			socket.on('roomFull', () => {
				dispatch({type: callTypes.CALL, payload: null});
				toast.error('Room was full');
			});

			socket.on('endCall', (conversationId) => {
				if (getState().call?.conversation?.id === conversationId) {
					toast.error('End call');
					dispatch({type: callTypes.CALL, payload: null});
				}
			});

			socket.on('updatePost', (post) => {
				dispatch({type: postTypes.UPDATE_POST, payload: post});
			});

			//receive message
			// socket.on('message', (message) => {
			// 	//update chat
			// 	const chat = getState().conversation.chats.find(
			// 		(item) => item._id === message.conversation
			// 	);
			// 	if (chat)
			// 		dispatch({
			// 			type: CONVERSATION_TYPES.UPDATE_CHAT,
			// 			payload: {...chat, messages: [message, ...chat.messages]},
			// 		});
			// 	//update conversations
			// 	const conversation = getState().conversation.conversations.find(
			// 		(item) => item._id === message.conversation
			// 	);
			// 	const user = getState().auth.user;

			// 	if (conversation) {
			// 		const index = conversation.members.indexOf(
			// 			conversation.members.find((member) => member._id === user._id)
			// 		);
			// 		dispatch({
			// 			type: CONVERSATION_TYPES.UPDATE_CONVERSATION_SORT,
			// 			payload: {
			// 				...conversation,
			// 				lastMessage: message,
			// 				seen: index ? [true, false] : [false, true],
			// 			},
			// 		});
			// 	} else {
			// 		const newConversation = {
			// 			_id: message.conversation,
			// 			members: [message.sender, message.receiver],
			// 			lastMessage: message,
			// 			seen: [true, false],
			// 		};
			// 		dispatch({
			// 			type: CONVERSATION_TYPES.ADD_CONVERSATION,
			// 			payload: newConversation,
			// 		});
			// 	}

			//set seen = true

			// 	const {active} = getState().conversation;
			// 	if (active) {
			// 		dispatch(seenConversation(active._id, active.other._id));
			// 	}
			// });

			//receive seen conversation
			// socket.on('seen_conversation', (conversationId) => {
			// 	const conversation = getState().conversation.conversations.find(
			// 		(item) => item._id === conversationId
			// 	);
			// 	dispatch({
			// 		type: CONVERSATION_TYPES.UPDATE_CONVERSATION,
			// 		payload: {...conversation, seen: [true, true]},
			// 	});
			// });

			//receive call
			// socket.on('call', (msg) => {
			// 	dispatch({type: CALL_TYPES.CALL, payload: msg});
			// });

			//receive end call
			// socket.on('endCall', () => {
			// 	dispatch({type: CALL_TYPES.CALL, payload: null});
			// });

			break;

		case 'POST':
			socket.emit('updatePost', payload);
			break;

		case 'socket/disconnect':
			socket && socket.disconnect();
			break;

		default:
			break;
	}

	return next(action);
};
