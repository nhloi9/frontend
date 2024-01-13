import React, { useEffect, useState } from 'react'
import { getApi } from '../network/api'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { postTypes } from '../Reduxs/Types/postType'
import Posts from '../Components/Home/Posts'
import Header from '../Components/Layout/Header'
const DetailPostPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { posts } = useSelector(state => state.post)

  useEffect(() => {
    if (id) {
      getApi('/posts/' + id)
        .then(({ data: { post } }) => {
          dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [post] })
        })
        .catch(err => {})
    }
  }, [id, dispatch])
  console.log({ posts })
  return (
    <div>
      <Header />
      <div className='w-full  max-w-[600px] mx-auto pt-[60px] pb-[10px]'>
        <Posts posts={posts} />
      </div>
    </div>
  )
}

export default DetailPostPage
