import React from 'react'
import LeftSide from '../Components/Message/LeftSide'
import RightSide from '../Components/Message/RightSide'
import Header from '../Components/Layout/Header'
import { useParams } from 'react-router-dom'

const MessagePage = () => {
  const { id } = useParams()
  return (
    <div>
      <Header />
      <div className='flex'>
        <LeftSide id={id} />
        <RightSide id={id} />
      </div>
    </div>
  )
}

export default MessagePage
