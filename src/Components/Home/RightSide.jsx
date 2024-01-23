import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Spin } from 'antd'
import { defaulAvatar } from '../../Constants'
import { getApi, postApi } from '../../network/api'
import { TfiReload } from 'react-icons/tfi'
import UserCard from './UserCard'
import AddFriend from '../Friend/AddFriend'
import Avatar from './Avatar'

const RightSide = () => {
  const navigate = useNavigate()
  const [suggestUser, setSuggestUser] = useState(null)
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    getApi('/friend-requests/suggests')
      .then(({ data: { suggests } }) => setSuggestUser(suggests?.slice(0, 5)))
      .catch(err => {})
  }, [])

  const getSuggestUser = () => {
    setLoading(true)
    getApi('/friend-requests/suggests')
      .then(({ data: { suggests } }) => {
        setSuggestUser(suggests?.slice(0, 5))
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })
  }

  return (
    <div className='flex px-3 py-3 flex-col h-screen bg-gray-100 shadow-lg border-2 rounded-l-xl overflow-y-hidden hover:overflow-y-scroll scroll-min'>
      <h1 className='mt-7 text-gray-600  text-[18px] '>Contacts</h1>
      <div className='flex gap-1 flex-col  mt-1'>
        {onlineFriends?.map(friend => (
          <div
            className='w-full h-[56px] gap-1 px-1  flex items-center hover:bg-gray-200 cursor-pointer rounded-md'
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
      <div className='flex justify-between items-center'>
        <h1 className=' my-3 text-gray-600  text-[18px] mt-5'>
          Suggest for you
        </h1>
        {!loading && (
          <TfiReload
            size={30}
            color='blue'
            className='!font-[600]  cursor-pointer '
            onClick={getSuggestUser}
          />
        )}
      </div>
      {loading ? (
        <div className=' w-full flex justify-center items-center my-4'>
          <Spin />
        </div>
      ) : (
        suggestUser &&
        suggestUser.map(
          userInfo =>
            !requests?.find(
              item =>
                item?.senderId === userInfo?.id ||
                item?.receiverId === userInfo?.id
            ) && (
              <div className='flex gap-2 items-center mb-2 '>
                <Avatar
                  src={userInfo?.avatar?.url ?? defaulAvatar}
                  className='cursor-pointer'
                  size={60}
                  onClick={() => {
                    navigate('/profile/' + userInfo?.id)
                  }}
                />
                <div className='flex flex-col gap-1 justify-center'>
                  <h1
                    className='cursor-pointer hover:underline'
                    onClick={() => {
                      navigate('/profile/' + userInfo?.id)
                    }}
                  >
                    {userInfo?.firstname + ' ' + userInfo?.lastname}
                  </h1>
                  <AddFriend type='suggest-home' friendInfo={userInfo} />
                  {/* <p>{text}</p> */}
                </div>
              </div>
            )
        )
      )}
    </div>
  )
}

export default RightSide
