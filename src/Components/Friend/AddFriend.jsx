import { Button } from 'antd'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { RiUserAddLine } from 'react-icons/ri'
import { MdCancel, MdOutlinePersonRemoveAlt1 } from 'react-icons/md'
import {
  friendCreateRequestAction,
  friendDeleteRequestAction,
  friendUpdateRequestAction
} from '../../Reduxs/Actions/friendAction'

const AddFriend = ({ friendInfo, card }) => {
  const { user } = useSelector(state => state.auth)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isLoading, requests } = useSelector(state => state.friend)

  const createRequest = async () => {
    try {
      dispatch(friendCreateRequestAction(friendInfo?.id))
    } catch (error) {
      toast.error(error)
    }
  }
  const deleteRequest = () => {
    myRequest?.id && dispatch(friendDeleteRequestAction(myRequest))
  }
  const updateRequest = () => {
    myRequest?.id && dispatch(friendUpdateRequestAction(myRequest))
  }

  const myRequest = useMemo(() => {
    return requests?.find(
      item =>
        item?.senderId === friendInfo?.id || item?.receiverId === friendInfo?.id
    )
  }, [requests, friendInfo?.id])
  console.log(myRequest)
  return (
    <div>
      {isLoading &&
      (friendInfo?.id === isLoading || myRequest?.id === isLoading) ? (
        <Button
          className={` bg-gray-200 ${
            card ? 'w-full' : ' w-full md:!w-[100px] '
          }`}
          loading
        ></Button>
      ) : !myRequest ? (
        <Button
          className={` bg-blue-500 ${card ? 'w-full' : 'w-full md:w-[150px] '}`}
          onClick={createRequest}
        >
          <div className=' w-full justify-center flex items-center gap-1'>
            <RiUserAddLine size={20} color='white' />
            <span className='!text-white'>{t('friend_add')}</span>
          </div>
        </Button>
      ) : myRequest?.status === 'accepted' ? (
        <Button
          className={` bg-red-400 ${card ? 'w-full' : 'w-full md:w-[160px]'}`}
          onClick={deleteRequest}
        >
          <div className=' w-full justify-center flex items-center gap-1'>
            <MdOutlinePersonRemoveAlt1 size={20} color='white' />
            <span className='!text-white '>Remove friend</span>
          </div>
        </Button>
      ) : myRequest?.receiverId === user?.id ? (
        <div className={`${card ? 'flex gap-2 flex-col' : 'flex gap-2'}`}>
          <Button
            className={` !text-white w-full  bg-blue-400 ${
              card ? 'md:w-full' : 'md:w-min'
            }`}
            onClick={updateRequest}
          >
            Confirm request
          </Button>
          <Button
            className={`!text-white bg-red-400 ${
              card ? 'md:w-full' : 'w-full md:w-min'
            }`}
            onClick={deleteRequest}
          >
            Delete Request
          </Button>
        </div>
      ) : (
        <Button
          className={` bg-red-400 ${
            card ? 'md:w-full' : 'w-full md:w-min !text-white'
          }`}
          onClick={deleteRequest}
        >
          <MdCancel className='!mr-1 !text-[18px] translate-y-[3px]' />{' '}
          {t('friend_cancel_request')}
        </Button>
      )}
    </div>
  )
}

export default AddFriend
/*

{!isLoading &&
  (myRequest&& myRequest?.status ==='accepted' ? (
    <Button className='w-full md:w-min bg-red-400' onClick={removeFriend}>
      {t('friend_remove')}
    </Button>
  ) : sendRequests.find(friend => friend.id === friendInfo.id) ? (
    <Button
      className='w-full md:w-min bg-red-400'
      onClick={cancelFriendRequest}
    >
      {t('friend_cancel_request')}
    </Button>
  ) : receiveRequests.find(friend => friend.id === friendInfo.id) ? (
    <div className={`${card ? 'flex gap-2 flex-col' : 'flex gap-2'}`}>
      <Button
        className={`w-full md:w-min bg-blue-400 ${card && 'md:w-full'}`}
        onClick={acceptFriendRequest}
      >
        {t('friend_accept')}
      </Button>
      <Button
        className={`w-full md:w-min bg-red-400 ${card && 'md:w-full'}`}
        onClick={rejectFriendRequest}
      >
        {t('friend_reject')}
      </Button>
    </div>
  ) : (
    <Button className='w-full md:w-min bg-blue-500' onClick={addFriend}>
      {t('friend_add')}
    </Button>
  ))}
{isLoading && (
  <Button className='!w-[100px] md:w-min bg-gray-200' loading></Button>
)}

*/
