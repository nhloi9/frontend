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

      <div className=' w-full pt-[60px] bg-gray-200 min-h-[100vh] flex relative '>
        <div className=' sticky h-[calc(100vh-60px)] top-[60px] xl:block left-0  w-[25%] max-w-[300px]'>
          <LeftSide type='save' />
        </div>
        <div className='w-[calc(100%-35px)]'>
          <div className='w-full '>
            <div className='w-full py-5 bg-white shadow'>
              <div className='w-[70%] mx-auto'>
                <h1 className='text-[26px]'>Saved Posts</h1>
                <p className='text-gray-500'>
                  You can review the list of saved posts
                </p>
              </div>
            </div>
            <div className=' mx-auto w-[90%] max-w-[700px] my-5 '>
              <Posts posts={posts} />
            </div>
          </div>
          {/* <div className='w-[70%] mx-auto my-5 '>
            <Posts posts={posts} />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default SavePostPage
