import { Avatar } from 'antd'
import React from 'react'
import SwipeableViews from 'react-swipeable-views'
import { AiFillPlusCircle } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import useSelection from 'antd/es/table/hooks/useSelection'
import { useSelector } from 'react-redux'
import { defaulAvatar } from '../../Constants'

const Stories = () => {
  const { stories } = useSelector(state => state.stories)
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  return (
    <div className='home-story mt-7 w-full '>
      <SwipeableViews>
        <div className=' w-max  gap-3 flex'>
          <div
            className='w-[140px]  relative h-[250px] shadow-xl rounded-lg border border-gray-300  cursor-pointer hover:opacity-70 '
            onClick={() => navigate('/stories/create')}
          >
            <img
              src={user?.avatar?.url ?? defaulAvatar}
              alt=''
              className='w-full h-full object-cover rounded-lg'
            />
            <div className='absolute w-full flex justify-center bottom-[15%] translate-y-4 z-30'>
              <AiFillPlusCircle
                size={30}
                color='blue'
                className=' !text-[30px]'
              />
            </div>
            <div className='absolute  bottom-0 h-[15%] rounded-b-lg left-0 w-full bg-gray-50  px-3 flex justify-end  flex-col items-center py-1 '>
              <h1 className='text-gray-700 font-[600] text-[14px]'>
                Create story
              </h1>
            </div>
            <div className='absolute top-3 left-0 w-full  px-3 '>
              <Avatar className='border-[3px] border-blue-500' />
            </div>
          </div>
          {stories.map((story, index) => (
            <div
              className='w-[140px]  relative h-[250px] rounded-lg  cursor-pointer border border-gray-300'
              key={story.id}
              onClick={() => {
                navigate('/stories', {
                  state: { current: index }
                })
              }}
            >
              <video
                src={story.video?.url}
                className='w-full h-full object-cover rounded-lg '
              ></video>
              <div className='absolute bottom-1 left-0 w-full  px-3 text-center'>
                <p className='text-gray-200 font-[600] text-[13px]'>
                  {story.user?.firstname + ' ' + story.user?.lastname}
                </p>
              </div>
              <div className='absolute top-3 left-0 w-full  px-3'>
                <Avatar
                  className='border-[3px] border-blue-500'
                  src={story.user?.avatar?.url ?? defaulAvatar}
                />
              </div>
            </div>
            // </Link>
          ))}
        </div>
      </SwipeableViews>
    </div>
  )
}

export default Stories
