import React, { useRef, useState, useEffect, useContext } from 'react'
import nature from '../../assets/images/nature.jpg'
import laptop from '../../assets/images/laptop.jpg'
import media from '../../assets/images/media.jpg'
import apps from '../../assets/images/apps.jpg'
import tik from '../../assets/images/tik.jpg'
import { useSelector } from 'react-redux'
import { defaulAvatar } from '../../Constants'
import { useNavigate } from 'react-router-dom'
import { FaFacebookMessenger, FaUserFriends } from 'react-icons/fa'
import { HiMiniUserGroup } from 'react-icons/hi2'
import { IoBookmark } from 'react-icons/io5'
import Avatar from './Avatar'

const LeftSide = ({ type }) => {
  const [data, setData] = useState([])
  const count = useRef(0)

  const handleRandom = arr => {
    setData(arr[Math.floor(Math.random() * arr?.length)])
  }

  useEffect(() => {
    const imageList = [
      {
        id: '1',
        image: laptop
      },
      {
        id: '2',
        image: media
      },
      {
        id: '3',
        image: apps
      },
      {
        id: '4',
        image: tik
      }
    ]
    handleRandom(imageList)
    let countAds = 0
    let startAds = setInterval(() => {
      countAds++
      handleRandom(imageList)
      count.current = countAds
      if (countAds === 5) {
        clearInterval(startAds)
      }
    }, 2000)

    return () => {
      clearInterval(startAds)
    }
  }, [])

  const progressBar = () => {
    switch (count.current) {
      case 1:
        return 20
      case 2:
        return 40
      case 3:
        return 60
      case 4:
        return 80
      case 5:
        return 100
      default:
        return 0
    }
  }

  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  return (
    <div className=' relative left-side w-full h-full   bg-gray-100    overflow-y-hidden hover:overflow-y-scroll scroll-min  pb-4   shadow-lg'>
      <div className='flex flex-col gap-1 pt-4 px-1 '>
        <div
          className='w-full h-[52px] px-2 flex items-center hover:bg-gray-200 cursor-pointer rounded-md'
          onClick={() => {
            navigate('/profile/' + user?.id)
          }}
        >
          <div className='h-full w-[40px] flex gap-1 items-center justify-center'>
            <Avatar size={36} src={user?.avatar?.url ?? defaulAvatar} />
          </div>
          <h1>{user?.firstname + ' ' + user?.lastname}</h1>
        </div>

        <div
          className='w-full h-[52px] px-2 flex items-center hover:bg-gray-200 cursor-pointer rounded-md'
          onClick={() => {
            navigate('/friends')
          }}
        >
          <div className='h-full w-[40px] gap-1 flex items-center justify-center'>
            <FaUserFriends className='!text-blue-400 text-[27px]' />
          </div>
          <h1>Friends</h1>
        </div>
        <div
          className='w-full h-[52px] px-2 flex items-center hover:bg-gray-200 cursor-pointer rounded-md'
          onClick={() => {
            navigate('/groups')
          }}
        >
          <div className='h-full w-[40px] gap-1 flex items-center justify-center'>
            <HiMiniUserGroup className='!text-blue-400 text-[27px]' />
          </div>
          <h1>Groups</h1>
        </div>
        <div
          className='w-full h-[52px] px-2 flex items-center hover:bg-gray-200 cursor-pointer rounded-md'
          onClick={() => {
            navigate('/message')
          }}
        >
          <div className='h-full w-[40px] gap-1 flex items-center justify-center'>
            <FaFacebookMessenger className='!text-blue-700 text-[27px]' />
          </div>
          <h1>Chat</h1>
        </div>
        <div
          className={`w-full h-[52px] px-2 flex items-center hover:bg-gray-200 cursor-pointer rounded-md ${
            type === 'save' && 'bg-gray-200'
          }`}
          onClick={() => {
            navigate('/saves')
          }}
        >
          <div className='h-full w-[40px] gap-1 flex items-center justify-center'>
            <IoBookmark className='!text-blue-400 text-[27px]' />
          </div>
          <h1>Saved</h1>
        </div>
      </div>
      <div className=' absolute bottom-16  w-full flex flex-col justify-center items-center pt-4'>
        <p className='font-roboto font-bold text-lg no-underline tracking-normal leading-none py-2'>
          Random Ads
        </p>
        <div
          style={{ width: `${progressBar()}%` }}
          className='bg-blue-600 rounded-xl h-1 mb-4'
        ></div>
        <img className='h-36 rounded-lg' src={data.image} alt='ads'></img>
      </div>
    </div>
  )
}

export default LeftSide
