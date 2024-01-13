import React from 'react'
import { useNavigate } from 'react-router-dom'

import { defaulAvatar } from '../../Constants'
import AddFriend from './AddFriend'

const FriendCard = ({ friend }) => {
  const navigate = useNavigate()
  return (
    <div className='h-[300px] w-[200px] relative  rounded-md shadow-md '>
      <img
        src={friend?.avatar?.url ?? defaulAvatar}
        alt=''
        className='block w-full h-full object-cover rounded-t-md rounded-md cursor-pointer'
        onClick={() => navigate('/profile/' + friend?.id)}
      />
      <div className='p-2 h-min w-full absolute bottom-0 right-0 bg-white border-t border-gray-100 rounded-b-md'>
        <p
          className='font-[600] mb-2 hover:underline cursor-pointer'
          onClick={() => navigate('/profile/' + friend?.id)}
        >
          {friend.firstname + ' ' + friend.lastname}
        </p>
        <AddFriend friendInfo={friend} card={true} />
      </div>
    </div>
  )
}

export default FriendCard
