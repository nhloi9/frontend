import Axios from 'axios';
import qs from 'qs';

const axios = Axios.create({
	baseURL: 'http://localhost:3333',
	timeout: 5000,
	withCredentials: true,
});

const omitObject = (obj) => {
	Object.keys(obj).forEach((key) => {
		if (obj[key] === undefined || obj[key] === null || obj[key] === '')
			delete obj[key];
	});
	return obj;
};

export const getApi = async (url, params = {}) => {
	try {
		const response = await axios.get(
			params ? url + '?' + qs.stringify(omitObject(params)) : url
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			return Promise.reject(
				error.response.data?.msg && typeof error.response.data?.msg === 'string'
					? error.response.data?.msg
					: 'Something went wrong'
			);
		}
		return await Promise.reject(error.message);
	}
};

export const postApi = async (url, data = {}) => {
	try {
		const response = await axios.post(url, omitObject(data));
		return response.data;
	} catch (error) {
		if (error.response) {
			return Promise.reject(
				error.response.data?.msg && typeof error.response.data?.msg === 'string'
					? error.response.data?.msg
					: 'Something went wrong'
			);
		}
		return await Promise.reject(error.message);
	}
};

export const deleteApi = async (url, params = {}) => {
	try {
		const response = await axios.delete(
			params ? url + '?' + qs.stringify(omitObject(params)) : url
		);
		return response.data;
	} catch (error) {
		if (error.response)
			return Promise.reject(
				error.response.data?.msg && typeof error.response.data?.msg === 'string'
					? error.response.data?.msg
					: 'Something went wrong'
			);
		return await Promise.reject(error.message);
	}
};

export const putApi = async (url, data) => {
	try {
		const response = await axios.put(url, data);
		return response.data;
	} catch (error) {
		if (error.response)
			return Promise.reject(
				error.response.data?.msg && typeof error.response.data?.msg === 'string'
					? error.response.data?.msg
					: 'Something went wrong'
			);
		return await Promise.reject(error.message);
	}
};
