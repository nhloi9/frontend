import React, { useEffect, useMemo, useRef, useState } from 'react'
import CardHeader from './CardHeader'
import CardBody from './CardBody'
import CardFooter from './CardFooter'
import PostModal from './PostModal'
import { useSelector } from 'react-redux'
import { postApi } from '../../network/api'

function useIsVisible (ref) {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    )

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref])

  return isIntersecting
}

const PostCard = ({ post, type }) => {
  const ref = useRef()
  const isVisible = useIsVisible(ref)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { requests } = useSelector(state => state.friend)
  const { user } = useSelector(state => state.auth)

  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])

  const checkPermissView = useMemo(() => {
    if (post?.userId === user?.id) return true
    if (friends?.find(friend => friend.id === post?.userId)) {
      if (post?.privacy !== 'private') return true
    } else if (post?.privacy === 'public') return true

    return false
  }, [post?.privacy, post?.userId, user?.id, friends])

  useEffect(() => {
    if (post?.accepted === false || checkPermissView === false) {
      setIsModalOpen(false)
    }
  }, [post?.accepted, post?.privacy, checkPermissView])

  useEffect(() => {
    if (isVisible) {
      postApi('/posts/' + post?.id + '/view').catch(err => {})
    }
  }, [isVisible, post?.id])

  return (
    <div
      ref={ref}
      className={`w-full !bg-white mt-3   border border-gray-200 
        rounded-md  mx-auto ${
          (post?.accepted === false || checkPermissView === false) &&
          'pointer-events-none opacity-40'
        }`}
    >
      <CardHeader post={post} type={type} />
      <CardBody post={post} />
      <CardFooter
        post={post}
        sModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <br />
      <div
        className='mx-3'
        onClick={() => {
          setIsModalOpen(true)
        }}
      >
        <input
          type='text'
          className='block w-full border-b border-gray-500  py-3 outline-none  bg-transparent cursor-pointer'
          placeholder='Enter your comment'
          readOnly
          // disabled
        />
      </div>
      <br />

      {isModalOpen && (
        <PostModal
          // createComment={createComment}
          post={post}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  )
}

export default PostCard
