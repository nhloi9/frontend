import React, {useEffect, useState} from 'react';
import Header from '../Components/Layout/Header';
import GroupDetail from '../Components/Group/GroupDetail';
import {useParams} from 'react-router-dom';
import {getApi} from '../network/api';

const DetailGroupPage = () => {
	useEffect(() => {
		console.log('groupDetailPage');
	}, []);
	return (
		<div>
			<Header />
			{<GroupDetail />}
		</div>
	);
};

export default DetailGroupPage;
