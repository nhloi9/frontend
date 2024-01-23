import React, { useEffect, useMemo, useRef, useState } from 'react'
import CardHeader from './CardHeader'
import CardBody from './CardBody'
import CardFooter from './CardFooter'
import PostModal from './PostModal'
import { useSelector } from 'react-redux'
// import CardBody from './CardBody'
// import CardFooter from './CardFooter'
// import InputComment from './InputComment.jsx'
// import Comments from './Comments.jsx'

const PostCard = ({ post, type }) => {
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

  return (
    <div
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
