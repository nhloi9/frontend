import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Button, Image, Modal, Spin, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { GiPositionMarker } from 'react-icons/gi'
import { IoCalendarOutline } from 'react-icons/io5'
import { IoIosCamera, IoIosVideocam } from 'react-icons/io'
import { FaGlobe, FaPhoneAlt } from 'react-icons/fa'

import AddFriend from '../Friend/AddFriend'
import { upload } from '../../utils/imageUpload'
import toast from 'react-hot-toast'
import { updateAvatarAction } from '../../Reduxs/Actions/authAction'
import EditProfile from './EditProfile'
import { Country, State } from 'country-state-city'
import ChangePassword from './ChangePassword'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Posts from '../Home/Posts'
import { GrCircleInformation } from 'react-icons/gr'
import Status from '../Home/Status'
import { CiLock, CiVideoOn } from 'react-icons/ci'
import ToMessageButton from '../Message/ToMessageButton'
import { MdArrowOutward } from 'react-icons/md'
import { defaulAvatar } from '../../Constants'
import Stories from '../Home/Stories'
import { storyTypes } from '../../Reduxs/Types/storyType'
import { globalTypes } from '../../Reduxs/Types/globalType'

const types = [
  {
    id: 1,
    text: 'Posts',
    to: null
  },
  {
    id: 2,
    text: 'Photos',
    to: 'photo'
  },
  {
    id: 3,
    text: 'Videos',
    to: 'video'
  },
  {
    id: 4,
    text: 'Friends',
    to: 'friend'
  },
  {
    id: 5,
    text: 'Stories',
    to: 'story'
  }
]

const Intro = ({ userInfo, own, files, friends, load }) => {
  let [searchParams, setSearchParams] = useSearchParams()
  const { user: me } = useSelector(state => state.auth)
  const { posts } = useSelector(state => state.post)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [avatar, setAvatar] = useState(userInfo?.avatar?.url)
  const [showUpdateAvatar, setShowUpdateAvatar] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openResetPassword, setOpenResetPassword] = useState(false)
  const { requests } = useSelector(state => state.friend)
  const { stories } = useSelector(state => state.stories)

  const navigate = useNavigate()
  const myRequest = useMemo(() => {
    return own
      ? null
      : requests?.find(
          item =>
            item?.senderId === userInfo?.id || item?.receiverId === userInfo?.id
        )
  }, [requests, userInfo?.id, own])
  const handleChangeAvatar = e => {
    setAvatar(e.target.files[0])
    setShowUpdateAvatar(true)
  }

  const confirm = () => {
    dispatch({ type: globalTypes.ALERT, payload: { loading: true } })

    upload([avatar])
      .then(images => {
        dispatch(updateAvatarAction(images[0]))
        setShowUpdateAvatar(false)
      })
      .catch(err => {
        dispatch({ type: globalTypes.ALERT, payload: { loading: false } })

        toast.error(err)
        setShowUpdateAvatar(false)
      })
  }

  const cancel = () => {
    setShowUpdateAvatar(false)
    setAvatar(userInfo?.avatar?.url)
  }

  console.log({ files })
  return (
    <div className='min-h-screen mx-auto w-[90%] lg:w-[70%] xl:w-[60%]'>
      <div className='bg-white shadow-sm px-5 pb-5 md:px-7  '>
        <div className='md:flex   md:pt-6    justify-between'>
          <div className='mb-2 md:mb-0'>
            <div className='flex gap-3'>
              <div className='relative w-[72px] h-[72px] -translate-y-5 md:translate-y-0 md:w-[100px] md:h-[100px] '>
                <img
                  src={
                    typeof avatar == 'string'
                      ? avatar
                      : avatar instanceof File
                      ? window.URL.createObjectURL(avatar)
                      : 'data:image/png;base64,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'
                  }
                  // referrerpolicy='no-referrer'
                  alt=''
                  className='w-full h-full block rounded-full  border-[1px] border-gray-200 '
                />
                {own && (
                  <label htmlFor='input-avatar'>
                    <IoIosCamera
                      className='absolute right-3 bottom-1 !text-gray-700  cursor-pointer'
                      size={20}
                      // onClick={handleChangeAvatar}
                    />
                  </label>
                )}

                <input
                  accept='image/png, image/gif, image/jpeg'
                  type='file'
                  hidden
                  id='input-avatar'
                  onChange={handleChangeAvatar}
                  onClick={e => {
                    e.target.value = null
                  }}
                />
              </div>
              <div className='pt-1 flex flex-col'>
                <h1 className='!font-[800] '>
                  {userInfo.firstname + ' ' + userInfo.lastname}
                </h1>
                {myRequest?.status === 'accepted' ? (
                  <img
                    src={require('../../assets/images/is_friend.png')}
                    alt=''
                    className='h-[24px] w-[80px] object-cover rounded-md mt-1'
                  />
                ) : (
                  <span className='text-sm text-gray-500 leading-3 md:leading-4'>
                    {friends?.length} friends
                  </span>
                )}

                {!own && (
                  <div className='mt-3'>
                    <ToMessageButton friend={userInfo} />
                  </div>
                )}
              </div>
            </div>

            {/* nav */}
            <div className='flex gap-4 mt-1 '>
              {types.map(item => (
                <span
                  key={item.to}
                  onClick={() => {
                    if (item.text === 'Posts') {
                      const type = searchParams.get('type')
                      if (type) {
                        searchParams.delete('type')
                        setSearchParams(searchParams)
                      }
                    } else {
                      setSearchParams({
                        type: item.to
                      })
                    }
                  }}
                  className={`no-underline cursor-pointer  font-[500] ${
                    searchParams?.get('type') === item.to && 'text-blue-600'
                  }`}
                >
                  {item.text}
                </span>
              ))}
            </div>
          </div>
          {own ? (
            <Button
              className='w-full md:w-min'
              icon={<EditOutlined />}
              onClick={() => setOpenEdit(true)}
            >
              {t('profile_edit')}
            </Button>
          ) : (
            <div>
              {myRequest?.receiverId === me?.id &&
                myRequest?.status === 'waiting' && (
                  <div>
                    <span className='text-gray-600  w-min mb-1'>
                      {userInfo?.firstname} sent you a friend request
                    </span>
                  </div>
                )}
              <AddFriend friendInfo={userInfo} />
            </div>
          )}
        </div>
        <div className='md:hidden'>
          <Info
            userInfo={userInfo}
            handle={() => {
              own && setOpenEdit(true)
            }}
            own={own}
          />
        </div>
      </div>

      <br />
      {searchParams.get('type') === null && (
        <div className='md:flex justify-between'>
          <div className='hidden mt-2 rounded-sm md:block md:w-[300px] h-min bg-white px-3 pb-3 shadow-sm'>
            <Info
              userInfo={userInfo}
              handle={() => {
                own && setOpenEdit(true)
              }}
              own={own}
            />
          </div>
          <div className='  min-h-screen w-full md:w-[calc(100%-350px)]'>
            {own && <Status />}
            {load && (
              <div className='w-min mx-auto mt-[50px]'>
                <Spin />
              </div>
            )}
            <Posts
              posts={posts?.filter(
                post =>
                  post?.userId === userInfo?.id ||
                  post?.tags?.find(tag => tag?.id === userInfo?.id)
              )}
            />
          </div>
        </div>
      )}
      {searchParams.get('type') === 'photo' &&
        (files?.filter(file =>
          /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file?.name)
        )?.length > 0 ? (
          <div className='w-full bg-white rounded-md min-h-[100px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-3 px-4 py-4 shadow-md'>
            {files
              ?.filter(file =>
                /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file?.name)
              )
              ?.map(item => (
                <div className='rounded-md overflow-hidden relative '>
                  <Image
                    preview={{
                      destroyOnClose: true,
                      mask: <div></div>
                    }}
                    src={item?.url}
                    alt=''
                    height={'180px'}
                    width={'100%'}
                    className={` block  object-cover rounded-md !hover:rounded-md !shadow-md`}
                  />
                  <div className='absolute top-1 right-1 z-10'>
                    <Tooltip title='Go to post'>
                      <div
                        className='w-6 h-6 flex items-center cursor-pointer justify-center rounded-sm bg-gray-200 shadow'
                        onClick={() => navigate('/post/' + item?.postId)}
                      >
                        <MdArrowOutward className='!text-gray-900  !text-[25px] ' />
                      </div>
                    </Tooltip>
                  </div>
                </div>
                // <img
                //   src={item.url}
                //   alt=''
                //   className='w-[180px] h-[170px] object-cover rounded-md'
                // />
              ))}
          </div>
        ) : (
          <div className='w-full bg-white rounded-md h-[100px] flex items-center justify-center'>
            <span className='text-gray-400'>No photos to show</span>
          </div>
        ))}

      {searchParams.get('type') === 'video' &&
        (files?.filter(file => file?.thumbnail)?.length > 0 ? (
          <div className='w-full bg-white rounded-md min-h-[100px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-3 px-4 py-4 shadow-md'>
            {files
              ?.filter(
                file => file?.thumbnail
                // /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file?.name)
              )
              ?.map(item => (
                <div className='rounded-md overflow-hidden relative'>
                  <Image
                    preview={{
                      destroyOnClose: true,
                      mask: <div></div>,
                      imageRender: () => (
                        <video
                          disablePictureInPicture
                          // muted
                          controls
                          src={item.url}
                          className='object-contain max-w-[80%] max-h-[80%] rounded-md'
                        />
                      ),
                      toolbarRender: () => null
                    }}
                    src={item?.thumbnail}
                    height={'180px'}
                    width={'100%'}
                    className={` block  object-cover rounded-md !hover:rounded-md`}
                  />
                  <div className='absolute top-1 right-1 z-10'>
                    <Tooltip title='Go to post'>
                      <div
                        className='w-6 h-6 flex items-center cursor-pointer justify-center rounded-sm bg-gray-200 shadow'
                        onClick={() => navigate('/post/' + item?.postId)}
                      >
                        <MdArrowOutward className='!text-gray-900  !text-[25px] ' />
                      </div>
                    </Tooltip>
                  </div>
                  <IoIosVideocam
                    className='!absolute !top-1 !left-1 z-0 !text-gray-700 '
                    size={20}
                  />
                </div>
                // <img
                //   src={item.url}
                //   alt=''
                //   className='w-[180px] h-[170px] object-cover rounded-md'
                // />
              ))}
          </div>
        ) : (
          <div className='w-full bg-white rounded-md h-[100px] flex items-center justify-center'>
            <span className='text-gray-400'>No videos to show</span>
          </div>
        ))}

      {searchParams.get('type') === 'friend' &&
        (friends?.length > 0 ? (
          <div className='w-full bg-white rounded-md min-h-[100px] grid grid-cols-2 gap-3 px-4 py-4 shadow-md'>
            {friends?.map(friend => (
              <div className='border w-full lg:h-[115px] h-[90px] rounded-md flex px-4 items-center gap-4'>
                <img
                  src={friend?.avatar?.url ?? defaulAvatar}
                  className='lg:w-20 lg:h-20 w-16 h-16 object-cover border  border-gray-200 rounded-md cursor-pointer'
                  alt=''
                  onClick={() => navigate('/profile/' + friend?.id)}
                />
                <h1
                  className='cursor-pointer hover:underline'
                  onClick={() => navigate('/profile/' + friend?.id)}
                >
                  {friend?.firstname + ' ' + friend?.lastname}
                </h1>
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full bg-white rounded-md h-[100px] flex items-center justify-center'>
            <span className='text-gray-400'>No friends to show</span>
          </div>
        ))}

      {searchParams.get('type') === 'story' &&
        (stories?.length > 0 ? (
          <div className='w-full bg-white rounded-md min-h-[100px] flex flex-wrap  px-4 py-4 shadow-md gap-3'>
            {stories.map((story, index) => (
              <div
                className='w-[140px]  relative h-[250px] rounded-md  cursor-pointer'
                key={story.id}
                onClick={() => {
                  dispatch({
                    type: storyTypes.STORY_PROFILE,
                    payload: 'profile'
                  })
                  navigate('/stories', {
                    state: { current: index }
                  })
                }}
              >
                <video
                  src={story.video?.url}
                  className='w-full h-full object-cover rounded-lg shadow'
                ></video>
                <div className='absolute bottom-1 left-0 w-full  px-3 text-center'>
                  <p className='text-gray-200 shadow-md font-[600] text-[13px]'>
                    {story.user?.firstname + ' ' + story.user?.lastname}
                  </p>
                </div>
                <div className='absolute top-3 left-0 w-full  px-3'>
                  <Avatar
                    className='border-[3px] border-blue-500'
                    src={story.user?.avatar?.url ?? defaulAvatar}
                  />
                </div>
              </div>
              // </Link>
            ))}
          </div>
        ) : (
          <div className='w-full bg-white rounded-md h-[100px] flex items-center  justify-center'>
            <span className='text-gray-400'>No stories to show</span>
          </div>
        ))}

      <Modal
        title='Update avatar'
        open={showUpdateAvatar}
        onOk={confirm}
        onCancel={cancel}
        maskClosable={false}
      ></Modal>
      {openEdit && (
        <EditProfile
          setOpenResetPassword={setOpenResetPassword}
          open={openEdit}
          onCancel={() => {
            setOpenEdit(false)
          }}
        />
      )}
      {openResetPassword && (
        <ChangePassword
          set={userInfo.password === null}
          open={openResetPassword}
          onCancel={() => {
            setOpenResetPassword(false)
          }}
        />
      )}
    </div>
  )
}

const Info = ({ userInfo, handle, own }) => {
  return (
    <div className='w-full flex flex-col gap-1 '>
      <div className='pt-5 md:pt-3'>
        <div className='flex items-center'>
          <div className='w-[25px] flex items-center'>
            <GiPositionMarker />
          </div>
          {userInfo?.detail?.country && userInfo?.detail?.state ? (
            <span className='max-w-[calc(100%-30px)]'>
              {
                State.getStateByCodeAndCountry(
                  userInfo?.detail?.state,
                  userInfo?.detail?.country
                )?.name
              }
              , {Country.getCountryByCode(userInfo?.detail?.country)?.name}
            </span>
          ) : own ? (
            <span className='cursor-pointer' onClick={handle}>
              +Add a address
            </span>
          ) : (
            <CiLock />
          )}
        </div>
      </div>
      <div className='flex items-center '>
        <div className='w-[25px] flex items-center'>
          <IoCalendarOutline />
        </div>

        {userInfo?.createdAt &&
          'Joined in ' +
            new Date(userInfo.createdAt).toLocaleString('en-us', {
              month: 'short',
              year: 'numeric'
            })}
      </div>
      <div className='flex items-start'>
        <div className='w-[25px] flex items-center'>
          <FaGlobe className='!translate-y-[1px]' />
        </div>

        {userInfo?.detail?.website ? (
          <a
            href={userInfo?.detail?.website}
            target='_blank'
            className='max-w-[calc(100%-30px)] no-underline'
            rel='noreferrer'
          >
            {userInfo?.detail?.website?.length > 30
              ? userInfo?.detail?.website?.slice(0, 30) + ' ...'
              : userInfo?.detail?.website}
          </a>
        ) : own ? (
          <p className='cursor-pointer' onClick={handle}>
            +Add a website
          </p>
        ) : (
          <CiLock />
        )}
      </div>

      <div className='flex items-start '>
        <div className='w-[25px] flex items-center'>
          <GrCircleInformation className='!translate-y-[2px]' />
        </div>

        {userInfo?.detail?.intro ? (
          <p className='max-w-[calc(100%-30px)]'>{userInfo?.detail?.intro} </p>
        ) : own ? (
          <span className='cursor-pointer' onClick={handle}>
            {' '}
            +Write some details about yourselfs
          </span>
        ) : (
          <CiLock />
        )}
      </div>
      <div className='flex items-center '>
        <div className='w-[25px] flex items-center'>
          <FaPhoneAlt />
        </div>

        {userInfo?.detail?.phone ? (
          <a
            href={'tel:' + userInfo?.detail?.phone}
            target='_blank'
            className='max-w-[calc(100%-30px)] no-underline'
            rel='noreferrer'
          >
            {userInfo?.detail?.phone}{' '}
          </a>
        ) : own ? (
          <span className='cursor-pointer' onClick={handle}>
            +Add a phone number
          </span>
        ) : (
          <CiLock />
        )}
      </div>
    </div>
  )
}

export default Intro
