import React, { useState } from 'react'
import { Button } from 'antd'
import { useSelector } from 'react-redux'
import { MdEditLocationAlt } from 'react-icons/md'
import { TbPhotoFilled } from 'react-icons/tb'

import CreatePost from './CreatePost'
import { BsEmojiSunglassesFill } from 'react-icons/bs'
import Avatar from './Avatar'
import { defaulAvatar } from '../../Constants'

const Status = () => {
  const [open, setOpen] = useState(false)

  const { user } = useSelector(state => state.auth)
  const handleSubmitPost = () => {}
  return (
    <div className='flex  mt-5 flex-col py-4 w-full border-gray-300 border bg-white rounded-xl shadow-sm'>
      <div className='flex items-center border-b-2   border-blue-400 pb-4 pl-4 w-full'>
        <Avatar
          size={40}
          src={user.avatar?.url ?? defaulAvatar}
          alt='avatar'
        ></Avatar>
        <form className='w-[calc(100%-50px)]' onSubmit={handleSubmitPost}>
          <div className='flex justify-between items-center'>
            <div className='w-full ml-4'>
              <input
                type='text'
                name='text'
                placeholder={`What's on your mind, ${user?.firstname}?`}
                className='outline-none w-full bg-gray-200 py-2 px-3 rounded-3xl cursor-pointer '
                readOnly={true}
                onClick={() => {
                  setOpen(true)
                }}
                // ref={text}
              ></input>
            </div>
            <div className='mx-4'></div>
            <div className='mr-4'>
              <Button
                type='link'
                onClick={() => {
                  setOpen(true)
                }}
              >
                Share
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className='flex justify-around items-center pt-4'>
        <div
          className='flex gap-1 cursor-pointer items-center'
          onClick={() => {
            setOpen(true)
          }}
        >
          <TbPhotoFilled size={27} className='!text-blue-500' />
          <p className='font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none'>
            Photo/video
          </p>
        </div>
        <div
          className='flex gap-1 cursor-pointer items-center'
          onClick={() => {
            setOpen(true)
          }}
        >
          <MdEditLocationAlt size={27} className='!text-green-500' />
          <p className='font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none'>
            Checkin
          </p>
        </div>
        <div
          className='flex gap-1 cursor-pointer items-center'
          onClick={() => {
            setOpen(true)
          }}
        >
          <BsEmojiSunglassesFill size={26} className='!text-yellow-300' />
          {/* <img className='h-8 ' src={smile} alt='feeling'></img> */}
          <p className='font-roboto font-medium text-md text-gray-700 no-underline tracking-normal leading-none'>
            Feeling
          </p>
        </div>
      </div>

      {open && <CreatePost open={open} setOpen={setOpen} />}
    </div>
  )
}

export default Status
