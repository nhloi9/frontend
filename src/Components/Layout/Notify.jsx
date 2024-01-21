import React, { useEffect, useState } from 'react'
// import { FiMoreHorizontal } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { IoSettingsOutline } from 'react-icons/io5'

import { BsFillBellFill, BsFillBellSlashFill } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Popover, Switch, Tooltip } from 'antd'
import { readNotifyAction } from '../../Reduxs/Actions/notifyAction '
import { notifyTypes } from '../../Reduxs/Types/notifyType'
import { globalTypes } from '../../Reduxs/Types/globalType'
import { defaulAvatar } from '../../Constants'

const Notify = () => {
  const { notifies, push, sound } = useSelector(state => state.notifies)
  const [type, setType] = useState('all')
  const [notifiesData, setNotifiesData] = useState([])
  // const { sound } = useSelector(state => state.notify)
  const dispatch = useDispatch()

  const openSoundNotify = () => {
    // dispatch({ type: NOTIFY_TYPES.SOUND, payload: true })
    // localStorage.setItem('sound', 'true')
  }
  const closeSoundNotify = () => {
    // dispatch({ type: NOTIFY_TYPES.SOUND, payload: false })
    // localStorage.setItem('sound', 'false')
  }
  const handleDeleteAllNotifications = () => {
    // const notReads = data.filter(notification => notification.isRead === false)
    // if (
    //   window.confirm(
    //     (notReads.length > 0
    //       ? `You have not read ${notReads.length} notifications`
    //       : '') + `, Are you sure you want to delete all notifications`
    //   )
    // ) {
    //   dispatch(deleteAllNotifies())
    // }
  }

  useEffect(() => {
    if (type === 'all') {
      setNotifiesData(notifies)
    } else {
      setNotifiesData(notifies.filter(notify => notify.isSeen === false))
    }
  }, [notifies, type])
  return (
    <div className='notify scroll-min  w-[350px] min-h-[50vh] max-h-[80vh]  relative  rounded-md !opacity-[1] hover:overflow-y-scroll overflow-y-hidden  cursor-default'>
      <div className=' flex justify-between items-center pb-1'>
        <h1 className='font-[500] text-[18px]'>Notifications</h1>

        <Popover
          trigger={'click'}
          placement='bottomLeft'
          content={
            <div className='bg-slate-100 rounded-md p-1'>
              <div className='flex justify-between'>
                <span>Sound</span>
                <Switch
                  checked={sound}
                  onChange={checked => {
                    localStorage.setItem('sound', checked)
                    dispatch({
                      type: notifyTypes.NOTIFY_SOUND,
                      payload: checked
                    })
                  }}
                />
              </div>
              <div className='flex justify-between'>
                <Tooltip title='Receive notifications on your device'>
                  Push
                </Tooltip>
                <Switch
                  checked={push}
                  // onChange={checked => {
                  //   dispatch({
                  //     type: notifyTypes.NOTIFY_PUSH,
                  //     payload: checked
                  //   })
                  // }}
                  onClick={(checked, e) => {
                    if (checked === false) {
                      localStorage.setItem('notify_push', JSON.stringify(false))
                      dispatch({
                        type: notifyTypes.NOTIFY_PUSH,
                        payload: false
                      })
                    } else {
                      if (!('Notification' in window)) {
                        // Check if the browser supports notifications

                        dispatch({
                          type: globalTypes.ALERT,
                          payload: {
                            error:
                              'This browser does not support desktop notification'
                          }
                        })
                      } else if (Notification.permission === 'granted') {
                        dispatch({
                          type: notifyTypes.NOTIFY_PUSH,
                          payload: true
                        })
                        localStorage.setItem(
                          'notify_push',
                          JSON.stringify(true)
                        )
                      } else {
                        if (Notification.permission !== 'denied') {
                          Notification.requestPermission().then(permission => {
                            if (permission === 'granted') {
                              dispatch({
                                type: notifyTypes.NOTIFY_PUSH,
                                payload: true
                              })
                              localStorage.setItem(
                                'notify_push',
                                JSON.stringify(true)
                              )
                            }
                          })
                        } else {
                          dispatch({
                            type: globalTypes.ALERT,
                            payload: {
                              error:
                                'Go to setting of browser and enable notifications'
                            }
                          })
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          }
          title='Setting'
          destroyTooltipOnHide
        >
          <IoSettingsOutline
            className='cursor-pointer'
            // onClick={closeSoundNotify}
          />
        </Popover>
      </div>
      <div className='flex gap-2 py-1 px-1 font-[600]'>
        <span
          className={`${type === 'all' && 'text-blue-500'} cursor-pointer`}
          onClick={() => setType('all')}
        >
          All
        </span>
        <span
          className={`${type !== 'all' && 'text-blue-500'} cursor-pointer`}
          onClick={() => setType('unRead')}
        >
          Unread
        </span>
      </div>
      {notifiesData.map(notify => (
        <NotifyCard key={notify.id} notify={notify} />
      ))}

      {notifiesData.length > 0 ? (
        // <div className='sticky -bottom-1 h-[40px]  bg-white border-t border-t-red-500 flex justify-end items-center text-red-400'>
        //   <span
        //     className='cursor-pointer'
        //     // onClick={handleDeleteAllNotifications}
        //   >
        //     delete all
        //   </span>
        // </div>
        <></>
      ) : (
        <div className='w-full h-max  flex items-center justify-center'>
          {type === 'all'
            ? ' You have no notifications'
            : ' You have no unread notifications'}
        </div>
      )}
    </div>
  )
}

const NotifyCard = ({ notify }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <Link
      to={notify?.url}
      className={`!text-black cursor-pointer flex w-full  px-1 py-2 hover:bg-gray-300 rounded-md justify-between ${
        notify.isSeen ? 'opacity-[0.6]' : ''
      }`}
      onClick={() => {
        dispatch(readNotifyAction(notify.id))
        navigate(notify.url)
      }}
    >
      <div
        className={`flex  items-center ${
          notify?.image ? 'w-[calc(100%-40px)]' : 'w-full'
        }`}
      >
        <Avatar
          src={notify?.sender?.avatar?.url ?? defaulAvatar}
          size={'big-avatar'}
        />
        <div className='pl-1 w-[calc(100%-40px)] overflow-hidden'>
          <p className=' text-[16px] '>
            <span className='font-[500] mr-1'>
              {notify?.sender?.firstname + ' ' + notify?.sender?.lastname}
            </span>
            {' ' + notify.text}{' '}
            {(notify.type === 'inviteGroup' || notify.type === 'postGroup') && (
              <span className='font-[600]'>{notify.expandData?.name}</span>
            )}
          </p>
          <p className='leading-[16px] text-[14px]'>
            {notify.content?.length > 15
              ? notify.content.slice(0, 15) + '...'
              : notify.content}
          </p>
          <p className='leading-[16px] text-[14px] text-gray-500'>
            {moment(notify.createdAt).fromNow()}
          </p>
        </div>
      </div>
      {notify?.image && (
        <div className='w-[40px] flex items-center'>
          <Avatar
            //  crossOrigin='anonymous'
            src={notify?.image}
            size='large'
          />
        </div>
      )}
    </Link>
  )
}
export default Notify
