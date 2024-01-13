import { Avatar } from 'antd'
import moment from 'moment'
import React from 'react'
import { FaPlus } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { GrFormPreviousLink } from 'react-icons/gr'

const LeftSide = ({ stories, current, setCurrent, type }) => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  return (
    <div className='!w-[300px]  pt-[70px] px-2 h-screen hidden md:block hover:overflow-y-scroll overflow-y-hidden bg-gray-50 shadow-md'>
      <h1 className='!font-[900] text-[24px]'>Stories</h1>
      <br />
      {type === 'profile' ? (
        <div>
          <h2 className='mb-2'>
            {' '}
            {type === 'profile' && (
              <span className='font-500 '>
                <GrFormPreviousLink
                  className='!font-[600] translate-y-[1px] cursor-pointer'
                  onClick={() => navigate('/profile/' + stories[0]?.user?.id)}
                />
              </span>
            )}{' '}
            {stories[0]?.user?.firstname}'s stories
          </h2>
          {stories.map((story, index) => (
            <div
              key={index}
              className={`flex px-2 rounded-md gap-2 items-center py-1 cursor-pointer ${
                index === current && 'bg-gray-300'
              }`}
              onClick={() => {
                setCurrent(index)
              }}
            >
              <div className='rounded-full border-[3px] border-blue-600 shadow'>
                <div className='rounded-full border-[3px] border-gray-100 shadow'>
                  <Avatar
                    size={'large'}
                    src={story?.user?.avatar?.url}
                    className='shadow'
                  />
                </div>
              </div>
              <div>
                <h1 className=''>
                  {story?.user?.firstname + ' ' + story?.user?.lastname}
                </h1>
                <p className='text-sm text-gray-500'>
                  {moment(story?.createdAt).fromNow()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2 className='mb-2'>Your Stories</h2>
          <div className='px-2 flex gap-2 items-center'>
            <div
              className='w-12 h-12 rounded-full bg-gray-100 cursor-pointer mt-1 mb-2 flex items-center justify-center'
              onClick={() => navigate('/stories/create')}
            >
              <FaPlus color='blue' size={20} />
            </div>
            <div className='flex flex-col justify-center  '>
              <p className='font-bold'>Create a story</p>
              <p className='text-gray-400 text-sm'> Share a video</p>
            </div>
          </div>
          {stories.map(
            (story, index) =>
              story?.user?.id === user?.id && (
                <div
                  key={index}
                  className={`flex px-2 rounded-md gap-2 items-center py-1 cursor-pointer ${
                    index === current && 'bg-gray-300'
                  }`}
                  onClick={() => {
                    setCurrent(index)
                  }}
                >
                  <div className='rounded-full border-[3px] border-blue-600 shadow'>
                    <div className='rounded-full border-[3px] border-gray-100 shadow'>
                      <Avatar
                        size={'large'}
                        src={story?.user?.avatar?.url}
                        className='shadow'
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className=''>
                      {story?.user?.firstname + ' ' + story?.user?.lastname}
                    </h1>
                    <p className='text-sm text-gray-500'>
                      {moment(story?.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              )
          )}
          <br />
          <h2 className='mb-2'>Friends Stories</h2>
          <div className='flex flex-col gap-3'>
            {stories.map(
              (story, index) =>
                story?.user?.id !== user?.id && (
                  <div
                    key={index}
                    className={`flex px-2 rounded-md gap-2 items-center py-1 cursor-pointer ${
                      index === current && 'bg-gray-300'
                    }`}
                    onClick={() => {
                      setCurrent(index)
                    }}
                  >
                    <div className='rounded-full border-[3px] border-blue-600 shadow'>
                      <div className='rounded-full border-[3px] border-gray-100 shadow'>
                        <Avatar
                          size={'large'}
                          src={story?.user?.avatar?.url}
                          className='shadow'
                        />
                      </div>
                    </div>
                    <div>
                      <h1 className=''>
                        {story?.user?.firstname + ' ' + story?.user?.lastname}
                      </h1>
                      <p className='text-sm text-gray-500'>
                        {moment(story?.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                )
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default LeftSide
