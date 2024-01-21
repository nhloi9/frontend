import React, { useState } from 'react'
import { IoHome } from 'react-icons/io5'
import { MdPeople } from 'react-icons/md'
import { GoReport } from 'react-icons/go'
import { useNavigate, useParams } from 'react-router-dom'

const filters = [
  {
    type: 'home',
    icon: IoHome,
    text: 'Home'
  },
  {
    type: 'user',
    icon: MdPeople,
    text: 'User'
  },
  {
    type: 'report',
    icon: GoReport,
    text: 'Reports'
  }
  // {
  //   type: 'group',
  //   icon: HiMiniUserGroup,
  //   text: 'Groups'
  // }
]
const Leftside = () => {
  const { type } = useParams()
  const navigate = useNavigate()

  return (
    <div className='flex flex-col sticky top-[60px] w-[350px]  bg-white h-[calc(100vh-60px)] shadow-lg border-r border-gray-300 p-3 group-left-side'>
      {filters.map((item, index) => (
        <div>
          <div
            onClick={() => navigate('/admin/' + item.type)}
            key={index}
            className={` cursor-pointer flex gap-2 p-2 hover:bg-gray-200 rounded-md my-3 items-center ${
              type === item.type && 'bg-gray-200'
            }`}
          >
            <div
              className={`h-9 w-9 rounded-full  flex items-center justify-center  ${
                type === item.type ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <item.icon className='!w-5 !h-5' />
            </div>
            <h1>{item.text}</h1>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Leftside
