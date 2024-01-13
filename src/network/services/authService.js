import {getApi} from '../api';

export const checkAuth = () => {
	return getApi('/users');
};
