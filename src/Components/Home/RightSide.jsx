import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar } from 'antd'
import { defaulAvatar } from '../../Constants'
import { postApi } from '../../network/api'

const RightSide = () => {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const { user } = useSelector(state => state.auth)
  const { requests } = useSelector(state => state.friend)
  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])

  const onlineUsers = useSelector(state => state.onlines)

  const onlineFriends = useMemo(() => {
    return friends.filter(friend => onlineUsers?.find(id => id === friend?.id))
  }, [friends, onlineUsers])

  return (
    <div className='flex flex-col h-screen bg-gray-100 shadow-lg border-2 rounded-l-xl overflow-y-hidden hover:overflow-y-scroll'>
      <h1 className='mt-7 mx-3 text-[18px] '>Contacts</h1>
      <div className='flex gap-1 flex-col px-1 mt-3'>
        {onlineFriends?.map(friend => (
          <div
            className='w-full h-[56px] gap-1 px-2 flex items-center hover:bg-gray-200 cursor-pointer rounded-md'
            onClick={() => {
              postApi('/conversations', {
                members: [friend.id]
              })
                .then(({ data: { conversation } }) => {
                  navigate(`/message/${conversation?.id}`)
                })
                .catch(error => console.log(error))
            }}
          >
            <div className='w-min h-min relative'>
              <Avatar size={36} src={friend?.avatar?.url ?? defaulAvatar} />
              <div className='w-3 h-3 bg-green-700 z-10 border border-white rounded-full absolute bottom-[2px] right-[2px]'></div>
            </div>

            <h1>{friend?.firstname + ' ' + friend?.lastname}</h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RightSide
