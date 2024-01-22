import React, { useEffect } from 'react'
import LeftSide from './LeftSide'
import Posts from '../Home/Posts'
import { useSelector } from 'react-redux'
import { Spin } from 'antd'

const GroupFeed = ({ load }) => {
  const { posts } = useSelector(state => state.post)
  return (
    <div className='pt-[60px] bg-gray-100 min-h-[105vh]  flex relative'>
      <LeftSide active={1} />
      <div className='w-[calc(100%-35px)]'>
        <div className='w-[70%] mx-auto my-5 '>
          {load && (
            <div className='w-min mx-auto mt-[100px]'>
              <Spin />
            </div>
          )}
          <Posts posts={posts} />
        </div>
      </div>
    </div>
  )
}

export default GroupFeed
