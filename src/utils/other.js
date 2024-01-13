export const filterFriends = (term, friends) => {
	if (!term?.trim()) return friends;
	const tokens = term
		?.trim()
		.split(' ')
		?.filter((item) => item !== '');
	return friends?.filter((friend) =>
		tokens?.every((token) =>
			(friend?.firstname + ' ' + friend?.lastname)
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.toLowerCase()
				?.includes(
					token
						?.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.toLowerCase()
				)
		)
	);
};
