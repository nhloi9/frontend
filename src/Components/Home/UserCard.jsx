import { Avatar } from 'antd'
import React from 'react'
import { defaulAvatar } from '../../Constants/index.js'

const UserCard = ({ userInfo, text, size }) => {
  return (
    <div className='flex gap-2 items-center'>
      <Avatar
        src={userInfo?.avatar?.url ?? defaulAvatar}
        size={size === 'sm' ? 'default' : 60}
      />
      <div className='flex flex-col justify-center'>
        <h1>{userInfo?.firstname + ' ' + userInfo?.lastname}</h1>

        <p>{text}</p>
      </div>
    </div>
  )
}

export default UserCard
