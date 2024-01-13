import React, { useEffect, useRef, useState } from 'react'
import CardHeader from './CardHeader'
import CardBody from './CardBody'
import CardFooter from './CardFooter'
import PostModal from './PostModal'
import { useDispatch } from 'react-redux'
import { createCommentAction } from '../../Reduxs/Actions/postAction'
// import CardBody from './CardBody'
// import CardFooter from './CardFooter'
// import InputComment from './InputComment.jsx'
// import Comments from './Comments.jsx'

const PostCard = ({ post, type }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  useEffect(() => {
    if (post?.accepted === false) {
      setIsModalOpen(false)
    }
  }, [post?.accepted])

  return (
    <div
      className={`w-full !bg-white mt-3   shadow-[0_0_1px] hover:shadow-[0_0_2px_gray]  rounded-md  mx-auto ${
        post?.accepted === false && 'pointer-events-none opacity-40'
      }`}
    >
      <CardHeader post={post} type={type} />
      <CardBody post={post} />
      <CardFooter
        post={post}
        sModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      {/* <div
        className='!pointer-events-none '
        onClick={() => {
          return
        }}
      >
        <InputComment
          createComment={createComment}
          post={post}
          disable={true}
        />
      </div> */}
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
