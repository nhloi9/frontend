import React, { useEffect, useState } from 'react'
import Header from '../Components/Layout/Header'
import { getApi } from '../network/api'
import { useDispatch, useSelector } from 'react-redux'
import { postTypes } from '../Reduxs/Types/postType'
import Posts from '../Components/Home/Posts'
import toast from 'react-hot-toast'
import { Spin } from 'antd'

const DisCoverPage = () => {
  const [load, setLoad] = useState(true)
  const dispatch = useDispatch()
  const { posts } = useSelector(state => state.post)
  useEffect(() => {
    getApi('/posts/top')
      .then(({ data: { posts } }) => {
        dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: posts })
        setLoad(false)
      })
      .catch(err => {
        setLoad(false)
        // toast.error(err)
      })

    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [dispatch])
  return (
    <div className='bg-gray-100'>
      <Header />
      <div className='w-full mt-[60px] py-5 bg-white shadow'>
        <div className='w-[70%] mx-auto'>
          <h1 className='text-[26px]'>Discover</h1>
          <p className='text-gray-500'>
            The most notable posts from last week.
          </p>
        </div>
      </div>
      {load && (
        <div className='w-min mx-auto mt-[100px]'>
          <Spin />
        </div>
      )}
      <div className=' px-4 max-w-[800px] min-h-screen mx-auto py-3 '>
        <Posts posts={posts} />
      </div>
    </div>
  )
}

export default DisCoverPage
