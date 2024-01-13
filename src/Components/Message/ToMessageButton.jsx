import { Button } from 'antd'
import React from 'react'
import { PiMessengerLogoLight } from 'react-icons/pi'
import { postApi } from '../../network/api'
import { useNavigate } from 'react-router-dom'

const ToMessageButton = ({ friend }) => {
  const navigate = useNavigate()
  const handleClickUser = () => {
    postApi('/conversations', {
      members: [friend?.id]
    })
      .then(({ data: { conversation } }) => {
        navigate(`/message/${conversation?.id}`)
      })
      .catch(error => console.log(error))
    // dispatch(createConversation(user))
  }
  return (
    <Button className='bg-gray-200' size='small' onClick={handleClickUser}>
      <span>
        <PiMessengerLogoLight /> Chat
      </span>
    </Button>
  )
}

export default ToMessageButton
