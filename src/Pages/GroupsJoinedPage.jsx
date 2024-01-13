import React, { useEffect } from 'react'
import Header from '../Components/Layout/Header'
import GroupFeed from '../Components/Group/GroupFeed'
import { getApi } from '../network/api'
import { useDispatch } from 'react-redux'
import { postTypes } from '../Reduxs/Types/postType'
import GroupsJoined from '../Components/Group/GroupsJoined'

const GroupsJoinedPage = () => {
  const dispatch = useDispatch()

  return (
    <div>
      <Header />
      <GroupsJoined />
    </div>
  )
}

export default GroupsJoinedPage
