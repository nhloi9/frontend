import React from 'react'
import { LeftSide } from '../Components/Friend/LeftSide'
import { RightSide } from '../Components/Friend/RightSide'
import Header from '../Components/Layout/Header'

const FriendsPage = () => {
  return (
    <div>
      <Header />
      <div className='pt-[60px] bg-gray-200 min-h-[100vh]  flex relative'>
        <LeftSide active={1} />
        <div className='w-[calc(100%-35px)]'>
          <RightSide />
        </div>
      </div>
    </div>
  )
}

export default FriendsPage
