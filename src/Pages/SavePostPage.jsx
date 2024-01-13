import React, { useEffect } from 'react'
import Header from '../Components/Layout/Header'
import LeftSide from '../Components/Home/LeftSide'
import RightSide from '../Components/Home/RightSide'
import Status from '../Components/Home/Status'
import Posts from '../Components/Home/Posts'
import { useDispatch, useSelector } from 'react-redux'
import Stories from '../Components/Home/Stories'
import { getApi } from '../network/api'
import { postTypes } from '../Reduxs/Types/postType'
import { getHomeStoriesAction } from '../Reduxs/Actions/storyAction'

const SavePostPage = () => {
  const savePosts = useSelector(state => state.save)
  const { posts } = useSelector(state => state.post)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({
      type: postTypes.GET_HOME_POST_SUCCESS,
      payload: savePosts
    })
    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [dispatch, savePosts])

  return (
    <div>
      <Header />

      <div className=' flex justify-center bg-gray-100 mt-[50px] '>
        <div className='hidden fixed h-screen xl:block left-0 w-[25%] max-w-[300px]'>
          <LeftSide type='save'> </LeftSide>
        </div>
        <div className='w-full  max-w-[600px] rounded-xl min-h-screen   '>
          <br />
          <Posts posts={posts} />
          <br />
          {/* <CardSection></CardSection> */}
          {/* <Main></Main> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default SavePostPage
