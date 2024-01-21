import React, { useEffect } from 'react'
import Header from '../Components/Layout/Header'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { postTypes } from '../Reduxs/Types/postType'
import { getApi } from '../network/api'
import Posts from '../Components/Home/Posts'

const HashtagPage = () => {
  const { hashtag } = useParams()
  const { posts } = useSelector(state => state.post)

  const dispatch = useDispatch()
  useEffect(() => {
    getApi('/posts/hashtag', { hashtag: '#' + hashtag })
      .then(({ data: { posts } }) => {
        dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: posts })
      })
      .catch(err => {})

    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [dispatch, hashtag])

  return (
    <div>
      <Header />
      <div className='w-full pt-[60px]'>
        <div className='w-full py-5 bg-white shadow'>
          <div className='w-[70%] mx-auto'>
            <h1 className='text-[26px]'>{'#' + hashtag}</h1>
            <p className='text-gray-500'>People are posting about this</p>
          </div>
        </div>
        <div className=' mx-auto w-[90%] max-w-[700px] my-5 '>
          <Posts posts={posts} />
        </div>
      </div>
    </div>
  )
}

export default HashtagPage
