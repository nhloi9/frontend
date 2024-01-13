import { Modal } from 'antd'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostCard from './PostCard'
import { getApi, postApi } from '../../network/api'
import Comments from './Comments'
import CardBody from './CardBody'
import CardFooter from './CardFooter'
import InputComment from './InputComment'
import CardHeader from './CardHeader'
import toast from 'react-hot-toast'

const PostModal = ({ post, isModalOpen, setIsModalOpen }) => {
  const commentRef = useRef()

  useEffect(() => {
    commentRef?.current?.scrollIntoView()
  }, [])

  return (
    <>
      <Modal
        destroyOnClose={true}
        width={1000}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
        }}
        footer={[]}
        maskClosable={false}
      >
        <div className='flex justify-center pt-2 pb-4'>
          <h1 className='text-[20px] '>{post.user?.firstname}'s Post</h1>
        </div>
        <div className='max-h-[70vh] overflow-y-scroll scroll-min'>
          <CardHeader post={post} />
          <CardBody post={post} />
          <CardFooter post={post} />
          <div ref={commentRef}></div>
          <InputComment post={post} />
          <Comments post={post} />
        </div>
      </Modal>
    </>
  )
}

export default PostModal
