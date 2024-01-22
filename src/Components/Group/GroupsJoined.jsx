import React from 'react'
import LeftSide from './LeftSide'
import { useSelector } from 'react-redux'
import { MdOutlinePublic } from 'react-icons/md'
import { FaLock } from 'react-icons/fa6'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const GroupsJoined = () => {
  const navigate = useNavigate()
  const { requests } = useSelector(state => state.group)
  return (
    <div className='pt-[60px] bg-gray-100 min-h-[105vh]  flex relative'>
      <LeftSide active={3} />
      <div className='w-[calc(100%-35px)]'>
        <div className='w-[80%] mx-auto my-5 '>
          <h1 className='my-3'>
            All groups you've joined (
            {requests?.filter(item => item?.status === 'accepted')?.length ?? 0}
            )
          </h1>
          {/* <hr className='bg-gray-400 h-[1px] my-2' /> */}
          {/* <Posts posts={posts} /> */}
          <div className='grid gap-3 grid-cols-2 lg:grid-cols-3'>
            {requests
              ?.filter(item => item?.status === 'accepted')
              ?.map(({ group }) => (
                <div className='rounded-md bg-white h-min p-3 '>
                  <div
                    className='flex items-center gap-2 '
                    // onClick={() => navigate('/groups/' + post?.group?.id)}
                  >
                    <img
                      src={group?.image?.url}
                      alt=''
                      className='w-20 h-20 rounded-md object-cover'
                    />
                    <div className='flex flex-col justify-center'>
                      <span className='font-bold'>{group?.name}</span>
                      <div>
                        <span className='text-gray-500 text-sm'>
                          <span>
                            {group?.privacy === 'public' ? (
                              <MdOutlinePublic className='!translate-y-[3px]' />
                            ) : (
                              <FaLock className='!translate-y-[3px]' />
                            )}
                          </span>
                          {' ' + group?.privacy + ' group'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className='w-full !mt-3 '
                    type='default'
                    onClick={() => navigate('/groups/' + group?.id)}
                  >
                    View group
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupsJoined
