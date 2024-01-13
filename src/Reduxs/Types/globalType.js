export const globalTypes = {
	ALERT: 'ALERT',
};

export const addOrUpdateToArray = (arrays, item) => {
	arrays = arrays.filter((element) => element.id !== item.id);
	arrays.push(item);
	return arrays;
};

export const updateToArray = (arrays, item) => {
	arrays = arrays.map((element) => (element.id === item.id ? item : element));
	return arrays;
};
