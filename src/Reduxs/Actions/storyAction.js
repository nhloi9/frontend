import {deleteApi, getApi, postApi} from '../../network/api';
import {postTypes} from '../Types/postType';
import {reacts} from '../../Constants';
import {storyTypes} from '../Types/storyType';
import {globalTypes} from '../Types/globalType';

export const getHomeStoriesAction = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: storyTypes.GET_HOME_STORIES_SUCCESS,
			payload: [],
		});
		const res = await getApi('/stories');
		dispatch({
			type: storyTypes.GET_HOME_STORIES_SUCCESS,
			payload: res.data.stories,
		});
		dispatch({
			type: storyTypes.STORY_PROFILE,
			payload: 'home',
		});
	} catch (error) {
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};

export const getProfileStoriesAction =
	(userId) => async (dispatch, getState) => {
		try {
			dispatch({
				type: storyTypes.GET_HOME_STORIES_SUCCESS,
				payload: [],
			});
			const res = await getApi('/users/' + userId + '/stories');
			dispatch({
				type: storyTypes.GET_HOME_STORIES_SUCCESS,
				payload: res.data.stories,
			});
			dispatch({
				type: storyTypes.STORY_PROFILE,
				payload: 'profile',
			});
		} catch (error) {
			// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
		}
	};

export const commentStory =
	(storyId, content) => async (dispatch, getState) => {
		try {
			const {
				data: {comment},
			} = await postApi('/stories/' + storyId + '/comment', {
				content,
			});
			const {stories} = getState().stories;
			const story = structuredClone(stories.find((item) => item.id === storyId));
			if (story) {
				story.comments = [comment, ...story.comments];
				dispatch({type: storyTypes.COMMENT_STORY_SUCCESS, payload: story});
			}
		} catch (error) {
			dispatch({type: globalTypes.ALERT, payload: {error}});
		}
	};

export const reactStory = (storyId, reactId) => async (dispatch, getState) => {
	try {
		// console.log(getState());
		await postApi('/stories/' + storyId + '/react', {
			reactId,
		});

		const {user} = getState().auth;
		const story = structuredClone(
			getState().stories?.stories?.find((item) => item.id === storyId)
		);
		story.reacts = story?.reacts.filter((react) => react.userId !== user.id);
		const react = reacts.find((react) => react.id === reactId);
		story?.reacts?.push({
			userId: user.id,
			user,
			reactId,
			react,
		});
		dispatch({
			type: storyTypes.REACT_STORY_SUCCESS,
			payload: story,
		});
	} catch (error) {
		console.log(error);
		// dispatch({type: globalTypes.ALERT, payload: {loading: false}});
	}
};
