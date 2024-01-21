import {
	addOrUpdateToArray,
	globalTypes,
	updateToArray,
} from '../Types/globalType';
import {upload} from '../../utils/imageUpload';
import {deleteApi, getApi, postApi, putApi} from '../../network/api';
import {postTypes} from '../Types/postType';
import {reacts} from '../../Constants';
import toast from 'react-hot-toast';

export const createPostAction =
	({content, photos, privacy, sentisment, location, hashtags, tags, groupId}) =>
	async (dispatch, getState) => {
		console.log(content);
		try {
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					loading: true,
				},
			});
			// console.log({photos});
			const thumbnailFiles = photos
				.filter((item) => item.thumbnailFile)
				.map((photo) => photo.thumbnailFile);

			const thumbnails = await upload(thumbnailFiles);

			const images = await upload(photos.map((photo) => photo.file));

			const {
				data: {post},
			} = await postApi('/posts', {
				files: images.map((image) => ({
					...image,
					thumbnail: thumbnails.find(
						(thumbnail) => image?.name?.slice(0, 4) === thumbnail?.name?.slice(0, 4)
					)?.url,
				})),
				hashtags,
				text: content,
				privacy,
				feel: sentisment,
				tags,
				location,
				groupId,
			});
			if (post?.accepted) {
				dispatch({
					type: postTypes.POST_CREATE_SUCCESS,

					payload: post,
				});
			}
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					success:
						post?.accepted === false
							? 'Your post is waiting for approval by the administrator'
							: 'You have successfully created the post',
				},
			});
		} catch (error) {
			console.log(error);
			dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		}
	};

export const sharePostAction =
	({postId, groupId}) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					loading: true,
				},
			});

			const {
				data: {post},
			} = await postApi('/posts', {
				shareId: postId,
				privacy: groupId ? 'public' : 'friend',
				groupId,
				hashtags: [],
			});

			if (post?.accepted === false) {
			} else {
				let sharedPost = getState().post?.posts?.find((item) => item.id === postId);

				if (sharedPost) {
					sharedPost = structuredClone(sharedPost);
					sharedPost.shareBys = [post, ...sharedPost.shareBys];
					dispatch({
						type: postTypes.POST,
						payload: sharedPost,
					});
				}

				const shareBys = getState()?.post?.posts?.filter(
					(item) => item?.shareId === postId
				);
				shareBys?.forEach((element) => {
					let copy = structuredClone(element);
					if (copy.share) copy.share.shareBys = [post, ...copy.share.shareBys];
					dispatch({
						type: postTypes.POST,
						payload: copy,
					});
				});
			}

			dispatch({
				type: globalTypes.ALERT,
				payload: {
					success:
						post?.accepted === false
							? 'Your share is waiting for admin approval'
							: 'Share post successfully',
				},
			});
		} catch (error) {
			console.log(error);
			dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		}
	};

export const updatePostAction =
	({content, photos, privacy, sentisment, hashtags, location, tags, postId}) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					loading: true,
				},
			});
			console.log({photos});
			const newFiles = photos.filter((photo) => photo.file);
			const oldFiles = photos.filter((photo) => !photo.file);

			const thumbnailFiles = newFiles
				.filter((item) => item.thumbnailFile)
				.map((photo) => photo.thumbnailFile);

			const thumbnails = await upload(thumbnailFiles);

			const images = await upload(newFiles.map((photo) => photo.file));
			// console.log({
			// 	newFiles,
			// 	oldFiles,
			// 	thumbnailFiles,
			// 	files: [
			// 		...oldFiles,
			// 		...images.map((image) => ({
			// 			...image,
			// 			thumbnail: thumbnails.find(
			// 				(thumbnail) => image?.name?.slice(0, 4) === thumbnail?.name?.slice(0, 4)
			// 			)?.url,
			// 		})),
			// 	],
			// });

			const {
				data: {post},
			} = await putApi('/posts/' + postId, {
				files: [
					...oldFiles,
					...images.map((image) => ({
						...image,
						thumbnail: thumbnails.find(
							(thumbnail) => image?.name?.slice(0, 4) === thumbnail?.name?.slice(0, 4)
						)?.url,
					})),
				],
				hashtags,
				text: content,
				privacy,
				feel: sentisment,
				tags,
				location,
			});
			dispatch({
				type: postTypes.POST,
				payload: post,
			});
			dispatch({
				type: globalTypes.ALERT,
				payload: {
					success:
						post?.accepted === false
							? 'Your post is waiting for approval by the administrator'
							: 'You have successfully created the post',
				},
			});
			// const msg = {
			// 	receiver: getState().auth.user.followers.map((user) => user._id),
			// 	target: res.data.post._id,
			// 	module: 'post',
			// 	url: `/post/${res.data.post._id}`,
			// 	text: 'added a new post',
			// 	image: images[0].secure_url,
			// 	content,
			// };
			// dispatch(createNotify(msg));
			// socket.emit(
			// 	'join_post',
			// 	// res.data.posts.map((post) => post._id)
			// 	[res?.data.post._id]
			// );
		} catch (error) {
			console.log(error);
			dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		}
	};

export const getHomePostsAction = () => async (dispatch, getState) => {
	try {
		console.log('get posts action');
		// console.log(getState());
		const {
			data: {posts},
		} = await getApi('/posts/home', {
			oldPosts: getState().post?.posts?.map((post) => post?.id),
		});
		dispatch({type: postTypes.GET_HOME_POST_SUCCESS, payload: posts});
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const reactPost = (postId, reactId) => async (dispatch, getState) => {
	try {
		// console.log(getState());
		await postApi('/posts/' + postId + '/react', {
			reactId,
		});

		const {user} = getState().auth;
		const post = structuredClone(
			getState().post.posts.find((item) => item.id === postId)
		);
		if (post) {
			post.reacts = post.reacts.filter((react) => react.userId !== user.id);
			const react = reacts.find((react) => react.id === reactId);
			post.reacts.push({
				userId: user.id,
				user,
				reactId,
				react,
				postId,
			});
			dispatch({
				type: postTypes.POST,
				payload: post,
			});
		}
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const likePost = (postId) => async (dispatch, getState) => {
	try {
		// console.log(getState());
		await postApi('/posts/' + postId + '/react', {
			reactId: 1,
		});
		const {user} = getState().auth;
		const post = structuredClone(
			getState().post?.posts.find((item) => item.id === postId)
		);
		if (post) {
			post.reacts = post.reacts.filter((react) => react.userId !== user.id);
			const react = reacts.find((react) => react.id === 1);
			post.reacts.push({
				userId: user.id,
				user,
				reactId: 1,
				react,
			});
			dispatch({
				type: postTypes.POST,
				payload: post,
			});
		}
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const removeReactPost = (postId) => async (dispatch, getState) => {
	try {
		await deleteApi('/posts/' + postId + '/react');
		const post = structuredClone(
			getState().post.posts.find((item) => item.id === postId)
		);
		const {user} = getState().auth;
		post.reacts = post.reacts.filter((react) => react.userId !== user.id);
		dispatch({
			type: postTypes.POST,
			payload: post,
		});
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const createCommentAction =
	({postId, content, parentId, receiverId}) =>
	async (dispatch, getState) => {
		try {
			const {
				data: {comment},
			} = await postApi('/comments', {postId, content, parentId, receiverId});
			const post = structuredClone(
				getState().post.posts.find((item) => item.id === postId)
			);
			post.comments.push(comment);
			dispatch({
				type: postTypes.POST,
				payload: post,
			});
		} catch (error) {
			toast.error(error);
		}
	};

export const reactComment =
	(comment, postId, type) => async (dispatch, getState) => {
		try {
			const {
				data: {react},
			} = await postApi(`/comments/${comment?.id}/react`, {
				type,
			});

			const post = structuredClone(
				getState().post?.posts?.find((item) => item.id === postId)
			);
			const updatedComment = {
				...comment,
				reacts: addOrUpdateToArray(comment.reacts, react),
			};

			if (post) {
				const newPost = {
					...post,
					comments: updateToArray(post.comments, updatedComment),
				};
				dispatch({
					type: postTypes.POST,
					payload: newPost,
				});
			}
		} catch (err) {
			toast.error(err);
		}
	};

export const unReactComment =
	(comment, postId) => async (dispatch, getState) => {
		try {
			await deleteApi(`/comments/${comment?.id}/react`);

			const post = structuredClone(
				getState().post?.posts?.find((item) => item.id === postId)
			);
			const updatedComment = {
				...comment,
				reacts: comment?.reacts?.filter(
					(item) => item?.userId !== getState()?.auth?.user?.id
				),
			};

			if (post) {
				const newPost = {
					...post,
					comments: updateToArray(post.comments, updatedComment),
				};
				dispatch({
					type: postTypes.POST,
					payload: newPost,
				});
			}
		} catch (err) {
			toast.error(err);
		}
	};

export const deleteCommentAction =
	(commentId, postId) => async (dispatch, getState) => {
		try {
			await deleteApi(`/comments/${commentId}`);

			const post = getState().post?.posts?.find((item) => item.id === postId);

			if (post) {
				const newPost = {
					...post,
					comments: post.comments?.filter((item) => item?.id !== commentId),
				};
				dispatch({
					type: postTypes.POST,
					payload: newPost,
				});
			}
		} catch (err) {
			toast.error(err);
		}
	};

export const updateComment =
	({commentId, postId, content}) =>
	async (dispatch, getState) => {
		try {
			// const newComment = {
			// 	...comment,
			// 	content: content,
			// };
			// let newPost = {
			// 	...post,
			// 	comments: updateArray(post.comments, {...newComment, updating: true}),
			// };

			// dispatch({
			// 	type: POST_TYPES.UPDATE_POST,
			// 	payload: newPost,
			// });

			const {
				data: {comment},
			} = await putApi(`/comments/${commentId}`, {
				content,
			});

			const post = structuredClone(
				getState().post?.posts?.find((item) => item.id === postId)
			);

			if (post) {
				const newPost = {
					...post,
					comments: updateToArray(post.comments, comment),
				};
				dispatch({
					type: postTypes.POST,
					payload: newPost,
				});
			}
		} catch (err) {
			toast.error(err);
		}
	};

export const getSavePostsAction = () => async (dispatch, getState) => {
	try {
		const {
			data: {posts},
		} = await getApi('/posts/save');
		dispatch({type: postTypes.GET_SAVE_POSTS_SUCCESS, payload: posts});
	} catch (error) {
		console.log(error);
	}
};

export const savePostsAction = (post) => async (dispatch, getState) => {
	try {
		await postApi('/posts/' + post?.id + '/save');
		dispatch({type: postTypes.SAVE_POST, payload: post});
	} catch (error) {
		toast.error(error);
	}
};
export const unsavePostsAction = (postId) => async (dispatch, getState) => {
	try {
		await postApi('/posts/' + postId + '/un-save');
		dispatch({type: postTypes.UN_SAVE_POST, payload: postId});
	} catch (error) {
		toast.error(error);
	}
};

export const deletePost = (postId) => async (dispatch, getState) => {
	try {
		await deleteApi('/posts/' + postId);
		dispatch({type: postTypes.DELETE_POST, payload: postId});
	} catch (error) {
		toast.error(error);
	}
};
