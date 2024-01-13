import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Toaster} from 'react-hot-toast';

import './i18n';

import {AiOutlineGlobal} from 'react-icons/ai';

import NoPage from './Pages/NoPage';
import Signin from './Pages/Signin';
import {Suspense, useEffect} from 'react';
import {checkAuthAction} from './Reduxs/Actions/authAction';
import Alert from './Components/Alert/Alert';
import Protected from './Components/Protect/Protected';
import HomePage from './Pages/HomePage';
import Signup from './Pages/SignUp';
import ActivationPage from './Pages/ActivationPage';
import {ConfigProvider, theme} from 'antd';
import ProfilePage from './Pages/ProfilePage';
import {getAllFriendRequestsAction} from './Reduxs/Actions/friendAction';
import PhotoPage from './Pages/PhotoPage';
import ForgetPasswordPage from './Pages/ForgetPasswordPage';
import StoriesPage from './Pages/StoriesPage';
import CreateStoryPage from './Pages/CreateStoryPage';
import CreateGroupPage from './Pages/CreateGroupPage';
import {getHomeStoriesAction} from './Reduxs/Actions/storyAction';
import DetailGroupPage from './Pages/DetailGroupPage';
import {getAllNotifiesAction} from './Reduxs/Actions/notifyAction ';
import MessagePage from './Pages/MessagePage';
import {getAllConversations} from './Reduxs/Actions/conversationAction ';
import GroupFeedPage from './Pages/GroupFeedPage';
import {
	getAllGroupRequestsOfUser,
	getAllOwnGroupOfUser,
} from './Reduxs/Actions/groupAction';
import CreateLocation from './Pages/CreateLocation';
import AdminPage from './Pages/AdminPage';
import CallModal from './Components/Message/CallModal';
import FriendsPage from './Pages/FriendsPage';
import DetailPostPage from './Pages/DetailPostPage';
import GroupsJoinedPage from './Pages/GroupsJoinedPage';
import {getSavePostsAction} from './Reduxs/Actions/postAction';
import SavePostPage from './Pages/SavePostPage';
import SearchPage from './Pages/SearchPage';
function App() {
	const dispatch = useDispatch();
	const {darkAlgorithm, defaultAlgorithm} = theme;
	const themeApp = useSelector((state) => state.theme);
	const {user, socketToken} = useSelector((state) => state.auth);
	const {call} = useSelector((state) => state);
	// const {activePost} = useSelector((state) => state.homePost);

	console.log(
		document.cookie
			.split('; ')
			.find((row) => row.startsWith('token'))
			?.split('=')[1]
	);

	useEffect(() => {
		dispatch(checkAuthAction());
	}, [dispatch]);

	useEffect(() => {
		if (themeApp === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [themeApp]);

	useEffect(() => {
		if (user?.id) {
			// dispatch(getHomePostsAction());

			dispatch(getAllNotifiesAction());
			dispatch(getAllConversations());
			dispatch(getAllGroupRequestsOfUser());
			dispatch(getAllOwnGroupOfUser());
			dispatch(getAllFriendRequestsAction());
			dispatch(getSavePostsAction());

			dispatch({
				type: 'socket/connect',
			});
		} else {
			dispatch({type: 'socket/disconnect'});
		}
		return () => dispatch({type: 'socket/disconnect'});
	}, [dispatch, user?.id, socketToken]);

	// useEffect(() => {

	// }, []);
	return (
		<div className="min-h-screen dark:bg-dark-200">
			<Suspense>
				<ConfigProvider
					theme={{
						algorithm: themeApp === 'dark' ? darkAlgorithm : defaultAlgorithm,
					}}
				>
					<BrowserRouter>
						<Alert />
						{/* <div className="fixed left-0 bottom-[100px] w-min h-min p-2 bg-[#00000076]">
							<AiOutlineGlobal
								size={'18px'}
								color="white"
								className="cursor-pointer"
							/>
						</div> */}
						{call && <CallModal call={call} />}

						{/* {activePost && <PostModal />} */}

						<Routes>
							<Route
								path="/"
								element={
									<Protected>
										<HomePage />
									</Protected>
								}
							/>

							<Route
								path="/profile/:id"
								element={
									<Protected>
										{/* <HomePage /> */}
										<ProfilePage />
									</Protected>
								}
							/>

							<Route
								path="/photo"
								element={
									<Protected>
										<PhotoPage />
									</Protected>
								}
							/>
							<Route
								path="/stories"
								element={
									<Protected>
										<StoriesPage />
									</Protected>
								}
							/>
							<Route
								path="/search"
								element={
									<Protected>
										<SearchPage />
									</Protected>
								}
							/>
							<Route
								path="/saves"
								element={
									<Protected>
										<SavePostPage />
									</Protected>
								}
							/>
							<Route
								path="/post/:id"
								element={
									<Protected>
										<DetailPostPage />
									</Protected>
								}
							/>
							<Route
								path="/signin"
								element={<Signin />}
							/>
							<Route
								path="/forget-password"
								element={<ForgetPasswordPage />}
							/>
							<Route
								path="/signup"
								element={<Signup />}
							/>
							<Route
								path="/stories/create"
								element={
									<Protected>
										<CreateStoryPage />
									</Protected>
								}
							/>
							<Route
								path="/groups/create"
								element={<CreateGroupPage />}
							/>

							<Route
								path="/groups/feed"
								element={
									<Protected>
										<GroupFeedPage />
									</Protected>
								}
							/>
							<Route
								path="/groups/join"
								element={
									<Protected>
										<GroupsJoinedPage />
									</Protected>
								}
							/>

							<Route
								path="/groups/:id/:type?"
								element={
									<Protected>
										<DetailGroupPage />
									</Protected>
								}
							/>

							<Route
								path="/locations/create"
								element={
									<Protected>
										<CreateLocation />
									</Protected>
								}
							/>

							<Route
								path="/message/:id?"
								element={
									<Protected>
										<MessagePage />
									</Protected>
								}
							/>

							<Route
								path="/admin"
								element={
									<Protected>
										<AdminPage />
									</Protected>
								}
							/>

							<Route
								path="/friends/:type?"
								element={
									<Protected>
										<FriendsPage />
									</Protected>
								}
							/>

							{/* <Route
								path="/friends/requests"
								element={
									<Protected>
										<FriendRequestPage />
									</Protected>
								}
							/> */}

							<Route
								path="/active-email/:token"
								element={<ActivationPage />}
							/>
							<Route
								path="*"
								element={<NoPage />}
							/>
						</Routes>
						<Toaster />
					</BrowserRouter>
				</ConfigProvider>
			</Suspense>
		</div>
	);
}

export default App;
