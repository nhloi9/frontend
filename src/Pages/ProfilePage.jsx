import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Facebook } from 'react-content-loader'
import { FaRegImage } from 'react-icons/fa'

import { getApi } from '../network/api'
import Header from '../Components/Layout/Header'
import Intro from '../Components/Profile/Intro'
import { Modal } from 'antd'
import { updateCoverImageAction } from '../Reduxs/Actions/authAction'
import toast from 'react-hot-toast'
import { upload } from '../utils/imageUpload'
import { postTypes } from '../Reduxs/Types/postType'
import { storyTypes } from '../Reduxs/Types/storyType'
import { getProfileStoriesAction } from '../Reduxs/Actions/storyAction'
import { defaultCoverImage } from '../Constants'
import { globalTypes } from '../Reduxs/Types/globalType'

const ProfilePage = () => {
  const [load, setLoad] = useState(false)
  const dispatch = useDispatch()
  const { id } = useParams()
  const { user: me } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [showUpdateCoverImage, setShowUpdateCoverImage] = useState(false)
  const { requests } = useSelector(state => state.friend)
  const [files, setFiles] = useState([])
  const myFriends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === me.id ? req.receiver : req.sender
    })
  }, [requests, me?.id])

  const [friends, setFriends] = useState([])

  const myRequest = useMemo(() => {
    return requests?.find(
      item => item?.senderId === me?.id || item?.receiverId === me?.id
    )
  }, [requests, me?.id])

  const handleChangeCoverImage = e => {
    setCoverImage(e.target.files[0])
    setShowUpdateCoverImage(true)
  }

  const confirm = () => {
    dispatch({ type: globalTypes.ALERT, payload: { loading: true } })
    upload([coverImage])
      .then(images => {
        dispatch(updateCoverImageAction(images[0]))
        setShowUpdateCoverImage(false)
      })
      .catch(err => {
        dispatch({ type: globalTypes.ALERT, payload: { loading: false } })

        toast.error(err)
        setShowUpdateCoverImage(false)
        setCoverImage(me.detail?.coverImage?.url)
      })
  }

  useEffect(() => {
    if (id !== me.id.toString()) {
      setLoading(true)
      getApi('/users/info/' + id)
        .then(data => {
          setUserInfo(data.data.user)
          setFriends(data?.data?.user?.friends ?? [])
          setLoading(false)
        })
        .catch(err => {})
    } else {
      setUserInfo(me)
    }
  }, [me, id])

  useEffect(() => {
    if (id === me?.id.toString()) {
      setFriends(myFriends)
    }
  }, [myFriends, id, me?.id])

  useEffect(() => {
    if (userInfo) setCoverImage(userInfo?.detail?.coverImage?.url)
  }, [userInfo])

  console.log({ requests, myRequest })
  useEffect(() => {
    if (id) {
      setLoad(true)
      getApi('/posts/user/' + id)
        .then(({ data: { posts } }) => {
          setLoad(false)
          dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: posts })
        })
        .catch(err => {
          setLoad(false)
        })
      getApi('/users/' + id + '/files')
        .then(({ data: { files } }) => {
          setFiles(files)
        })
        .catch(err => {
          setFiles([])
        })
    }
    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [id, dispatch, myRequest?.status])
  useEffect(() => {
    if (id) {
      dispatch(getProfileStoriesAction(id))
    }
  }, [id, dispatch])
  return (
    <div>
      <Header />
      {loading && (
        <div className='mt-[60px] p-10'>
          <Facebook />
        </div>
      )}
      {!loading && userInfo && (
        <div className='min-h-screen bg-[#fcf8f8]  '>
          <div className='w-full h-[120px] md:h-[350px] bg-[#e4d8d8] relative'>
            {
              <img
                src={
                  typeof coverImage === 'string'
                    ? coverImage
                    : coverImage instanceof File
                    ? window.URL.createObjectURL(coverImage)
                    : defaultCoverImage
                }
                className='block w-full h-full object-cover'
                alt={userInfo.fullname}
              />
            }
            {id === me.id.toString() && (
              <label
                htmlFor='input-cover-image'
                className='absolute z-10 top-[50%] left-[50%] -translate-x-[50%] flex cursor-pointer'
              >
                <FaRegImage /> &nbsp;
                <p>add a cover image</p>
              </label>
            )}
            <input
              type='file'
              id='input-cover-image'
              className='hidden'
              onChange={handleChangeCoverImage}
              accept='image/png, image/gif, image/jpeg'
            />
          </div>
          {userInfo && (
            <Intro
              load={load}
              friends={friends}
              userInfo={userInfo}
              own={id === me.id.toString()}
              files={files}
            />
          )}
        </div>
      )}
      <Modal
        title='Update cover image'
        open={showUpdateCoverImage}
        onOk={confirm}
        onCancel={() => {
          setShowUpdateCoverImage(false)
          setCoverImage(userInfo?.detail?.coverImage?.url)
        }}
        maskClosable={false}
      ></Modal>
    </div>
  )
}

export default ProfilePage
