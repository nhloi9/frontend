import React from 'react'
import { Button } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const navItems = []

const LeftSide = ({ active }) => {
  const { ownGroups, requests } = useSelector(state => state.group)
  const navigate = useNavigate()

  return (
    <div className='flex flex-col sticky top-[60px] w-[350px]  bg-white h-[calc(100vh-60px)] shadow-lg border-r border-gray-300 p-3 group-left-side'>
      <div className='border-b border-gray-300'>
        <h1 className='font-[700] text-[24px]'>Groups</h1>
        <input
          className='block w-full mt-3 mb-3 px-4 py-2 bg-gray-200 rounded-2xl !border-none focus:outline-none'
          placeholder='🔍 Search by name'
        ></input>
      </div>
      <div className='h-full overflow-hidden hover:overflow-y-scroll scroll-min pt-2'>
        <div>
          <div
            className={`flex gap-2 items-center h-[50px] px-1 rounded-md hover:bg-gray-200 cursor-pointer ${
              active === 1 ? 'bg-gray-200 ' : ''
            }`}
            onClick={() => navigate('/groups/feed')}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                active === 1 ? 'bg-blue-500 ' : 'bg-gray-300'
              }`}
            >
              <i className={` feed ${active === 1 ? 'invert' : ''}`}></i>
            </div>
            <h1>Your feed</h1>
          </div>
          <div
            className={`flex gap-2 items-center h-[50px] px-1 rounded-md hover:bg-gray-200 cursor-pointer ${
              active === 2 ? 'bg-gray-200 ' : ''
            }`}
            onClick={() => navigate('/groups/discover')}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                active === 2 ? 'bg-blue-500 ' : 'bg-gray-300'
              }`}
            >
              <i className={` discover ${active === 2 ? 'invert' : ''}`}></i>
            </div>
            <h1>Discover</h1>
          </div>
          <div
            className={`flex gap-2 items-center h-[50px] px-1 rounded-md hover:bg-gray-200 cursor-pointer ${
              active === 3 ? 'bg-gray-200 ' : ''
            }`}
            onClick={() => navigate('/groups/join')}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                active === 3 ? 'bg-blue-500 ' : 'bg-gray-300'
              }`}
            >
              <i className={` groups ${active === 3 ? 'invert' : ''}`}></i>
            </div>
            <h1>Your groups</h1>
          </div>
          <Button
            className='!w-full !my-3 '
            type='primary'
            onClick={() => {
              navigate('/groups/create')
            }}
          >
            + Create group
          </Button>
        </div>
        {ownGroups?.length > 0 && (
          <>
            <hr className='h-[1px] bg-gray-300' />

            <div>
              <h1 className='text-[18px] my-2'>Groups you manage</h1>
              {ownGroups?.map(groupData => (
                <GroupNavCard groupData={groupData} />
              ))}
            </div>
          </>
        )}

        {requests?.filter(item => item?.status === 'accepted')?.length > 0 && (
          <>
            <hr className='h-[1px] bg-gray-300' />
            <div>
              <h1 className='text-[18px] my-2'>Groups you've joined</h1>
              {requests
                ?.filter(item => item?.status === 'accepted')
                ?.map(({ group }) => (
                  <GroupNavCard groupData={group} />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const GroupNavCard = ({ groupData }) => {
  const navigate = useNavigate()
  return (
    <div
      className='flex gap-2 items-center px-1 py-2 my-1 cursor-pointer hover:bg-gray-200 rounded-md'
      onClick={() => {
        navigate('/groups/' + groupData.id)
      }}
    >
      <div className='w-11 h-11 rounded-md '>
        <img
          src={groupData?.image?.url}
          alt=''
          className='w-full h-full object-cover rounded-md'
        />
      </div>
      <div className='flex flex-col justify-center'>
        <p className='text-[18px] font-[500]'>{groupData?.name}</p>
        <span className='text-gray-500 text-sm'>
          Last active about an hour ago
        </span>
      </div>
    </div>
  )
}

export default LeftSide
