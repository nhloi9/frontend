import {postApi} from '../network/api';
export const validImage = (file) => {
	if (!file) return 'File does not exist';
	if (file.type !== 'image/jpeg' && file.type !== 'image/png')
		return 'Invalid file type';
	if (file.size > 1024 * 1024) return 'size of image must be less than  1 MB';
	return '';
};
export const upload = async (files) => {
	const url = 'http://localhost:3333/files';
	const promises = [];

	files.forEach((file) => {
		const formdata = new FormData();
		formdata.append('file', file);
		// axios.post(url, formdata).then((response) => {
		// 	console.log(response.data.secure_url);
		// });
		promises.push(
			postApi(url, formdata)
				.then((response) => response.data.file)
				.catch((err) => {
					throw err;
				})
		);
	});
	const images = await Promise.all(promises);
	return images;
};
