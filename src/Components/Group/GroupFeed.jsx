import React, { useEffect } from 'react'
import LeftSide from './LeftSide'
import Posts from '../Home/Posts'
import { useSelector } from 'react-redux'

const GroupFeed = () => {
  const { posts } = useSelector(state => state.post)
  return (
    <div className='pt-[60px] bg-gray-200 min-h-[100vh]  flex relative'>
      <LeftSide active={1} />
      <div className='w-[calc(100%-35px)]'>
        <div className='w-[70%] mx-auto my-5 '>
          <Posts posts={posts} />
        </div>
      </div>
    </div>
  )
}

export default GroupFeed
