import React, { useEffect, useState } from 'react'
import Header from '../Components/Layout/Header'
import GroupFeed from '../Components/Group/GroupFeed'
import { getApi } from '../network/api'
import { useDispatch } from 'react-redux'
import { postTypes } from '../Reduxs/Types/postType'
import toast from 'react-hot-toast'

const GroupFeedPage = () => {
  const [load, setLoad] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    getApi('/posts/group/feed')
      .then(({ data: { posts } }) => {
        dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: posts })
        setLoad(false)
      })
      .catch(err => {
        toast.error(err)
        setLoad(false)
      })

    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [dispatch])
  return (
    <div>
      <Header />
      <GroupFeed load={load} />
    </div>
  )
}

export default GroupFeedPage
