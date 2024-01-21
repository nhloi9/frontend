import React, { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { IoIosNotifications } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { Dropdown, Input, Popconfirm, Popover } from 'antd'
import { IoLogOut } from 'react-icons/io5'

import { logoutAction } from '../../Reduxs/Actions/authAction'
import { defaulAvatar } from '../../Constants'
import Notify from './Notify'
import { FaFacebookMessenger } from 'react-icons/fa6'
import { MdSearch } from 'react-icons/md'
import { filterFriends } from '../../utils/other'
import { MdAdminPanelSettings } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import Avatar from '../Home/Avatar'

const Header = () => {
  const navigate = useNavigate()
  const { notifies, push, sound } = useSelector(state => state.notifies)
  const dispatch = useDispatch()
  const { isLogin, user } = useSelector(state => state.auth)
  const [openNotify, setOpenNotify] = useState(false)

  const leftNavItems = [
    {
      title: 'Home',
      to: '/'
    },
    {
      title: 'Group',
      to: '/groups'
    },
    {
      title: 'Friends',
      to: '/friends'
    },
    { title: 'Discover', to: '/discover' }
  ]

  const onSearch = (value, _e, info) => console.log(info?.source, value)

  const confirmLogout = e => {
    dispatch(logoutAction())
  }
  const cancelLogout = e => {
    // console.log(e)
    // toast.error('Click on No')
  }

  useEffect(() => {
    console.log('header mount')
    return () => {
      console.log('header unmount')
    }
  })

  return (
    <div className='fixed bg-gray-50  w-full z-[50] top-0 h-[60px] shadow-sm border-b border-gray-200 flex justify-between items-center font-robo dark:bg-dark-100 px-5'>
      <div
        className=' items-center gap-1 p-1 cursor-pointer hidden sm:flex'
        onClick={() => navigate('/')}
      >
        <img
          src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNv64PGHyyyJkxGRb5g2RSRR93Uwb3snu5ZA&usqp=CAU'
          alt=''
          className='w-[40px] h-[40px] block object-cover rounded-full'
        />
        <h1 className='font-[800] text-[22px]'>Horizon</h1>
      </div>
      <SearchBox />

      <div className='md:flex gap-3  hidden '>
        {leftNavItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => {
              return isActive
                ? ' text-blue-600   hover:bg-gray-300 py-1 px-2 rounded-2xl !no-underline '
                : ' hover:bg-gray-300 py-1 px-2 rounded-2xl text-black no-underline'
            }}
          >
            <span className='text-[16px] font-[700]'>{item.title}</span>
          </NavLink>
        ))}
      </div>
      <div className='flex items-center gap-2 header-notify'>
        <div
          className='w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 cursor-pointer'
          onClick={() => {
            navigate('/message')
          }}
        >
          <FaFacebookMessenger size={20} />
        </div>
        <Popover
          placement='bottomRight'
          destroyPopupOnHide
          content={<Notify />}
          // title="Title"
          trigger='click'
          open={openNotify}
          onOpenChange={newOpen => {
            setOpenNotify(newOpen)
          }}
          className='!relative'
        >
          <div className='w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 cursor-pointer'>
            <IoIosNotifications size={24} />
          </div>
          <div className='absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center'>
            <p className='text-[12px] text-gray-50 '>
              {notifies.filter(notify => notify.isSeen === false)?.length}
            </p>
          </div>
        </Popover>
        {isLogin ? (
          <div className='h-[40px] w-[40px]'>
            <Dropdown
              menu={{
                items: [
                  {
                    key: '1',
                    label: (
                      <Link to={'/profile/' + user?.id}>
                        <div className='flex items-center gap-[4px]'>
                          <FaUser size={14} />
                          Profile
                        </div>
                      </Link>
                    )
                  },
                  user?.role === 'admin' && {
                    key: '2',
                    label: (
                      <Link to={'/admin/home'}>
                        <div className='flex items-center'>
                          <MdAdminPanelSettings /> Admin tool
                        </div>
                      </Link>
                    )
                  },
                  {
                    key: '3',
                    label: (
                      <Popconfirm
                        title='Logout'
                        description='Are you sure to logout?'
                        onConfirm={confirmLogout}
                        onCancel={cancelLogout}
                        okText='Yes'
                        cancelText='No'
                        placement='leftBottom'
                      >
                        <div className='flex items-center '>
                          <IoLogOut size={16} /> Logout
                        </div>
                      </Popconfirm>
                    )
                  }
                ]
              }}
              placement='bottomLeft'
            >
              {/* <Avatar size={40} src={user?.avatar?.url ?? defaulAvatar} /> */}
              <img
                // referrerpolicy='no-referrer'
                src={user?.avatar?.url ?? defaulAvatar}
                alt=''
                className='block w-[40px] h-[40px] object-cover rounded-full border-gray-300 shadow border-[1px] cursor-pointer'
              />
            </Dropdown>
          </div>
        ) : (
          <Link to={'/signin'} className='h-[40px] w-[40px] '>
            {/* <Avatar src={defaulAvatar} className='' /> */}
          </Link>
        )}
      </div>
    </div>
  )
}

const SearchBox = () => {
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const [users, setUsers] = useState([])

  const { user } = useSelector(state => state.auth)
  const { requests } = useSelector(state => state.friend)
  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])
  useEffect(() => {
    if (term && term.trim().length > 0) {
      try {
        setUsers(filterFriends(term, friends))
      } catch (error) {
        setUsers([])
      }
    } else setUsers([])
  }, [term, friends])

  const handleSearch = () => {
    if (term?.trim()) {
      const store = localStorage.getItem('search')
      let search = []
      if (
        store &&
        JSON.parse(store) &&
        JSON.parse(store).constructor === Array
      ) {
        search = JSON.parse(store)
      }
      localStorage.setItem(
        'search',
        JSON.stringify([term.trim(), ...search.slice(0, 7)])
      )
      console.log(localStorage.getItem('search'))
      navigate('/search?query=' + term.trim())
    }
  }

  return (
    <div className='w-[290px]'>
      <Popover
        content={
          <div className='w-[244px] '>
            {users.map(user => (
              <div
                className='w-full rounded-md my-2 p-1 cursor-pointer hover:bg-gray-200 flex gap-2 items-center'
                onClick={() => navigate('/profile/' + user?.id)}
              >
                <Avatar src={user?.avatar?.url ?? defaulAvatar} size={36} />
                <div>
                  <p className='font-[500] text-[14px]'>
                    {user?.firstname + ' ' + user?.lastname}
                  </p>
                  <p className='leading-4 text-[14px] font-[400] text-gray-400'>
                    Friend
                  </p>
                </div>
              </div>
            ))}
            <div
              className='w-full cursor-pointer rounded-md mt-2 p-1 hover:bg-gray-200 flex gap-2 items-center'
              onClick={handleSearch}
            >
              <div className='w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center'>
                <MdSearch size={20} color='white' />
              </div>
              <p className=' text-blue-500 font-[300] text-sm'>
                Search for <span className='font-[500] text-sm'> {term}</span>
              </p>
            </div>
          </div>
        }
        // trigger='click'
        placement='bottomLeft'
        title=''
      >
        <div className='w-full '>
          <div className='w-min relative'>
            <form
              action=''
              onSubmit={e => {
                e.preventDefault()
                handleSearch()
              }}
            >
              <Input
                placeholder='Search on Horizon'
                className=' !border-blue-600 !border-[1px] focus:w-[270px] w-[230px] h-[35px] py-1  pl-8 pr-6 appearance-none rounded-[15px]   '
                type='text'
                value={term}
                onChange={e => {
                  setTerm(e.target.value)
                }}
              />
            </form>
            <MdSearch
              className='!absolute top-[6px] left-[6px] !text-blue-600'
              size={25}
            />
            {/* {term && (
              <IoCloseCircleSharp
                size={25}
                className='!text-gray-400 absolute top-[5px] right-1 cursor-pointer'
                onClick={() => {
                  setTerm('')
                }}
              />
            )} */}
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default Header
