import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BsHeart, BsHeartFill } from 'react-icons/bs'
import moment from 'moment'
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from 'react-icons/bi'
import InputComment from './InputComment'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown, Tooltip } from 'antd'
import { AiOutlineMore } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { MdDeleteOutline } from 'react-icons/md'
import {
  deleteCommentAction,
  reactComment,
  unReactComment,
  updateComment
} from '../../Reduxs/Actions/postAction'
import { defaulAvatar } from '../../Constants'
import Avatar from '../Home/Avatar'

// import EditIcon from '@mui/icons-material/Edit'
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
// import {
//   deleteComment,
//   likeComment,
//   unlikeComment,
//   updateComment
// } from '../../redux/actions/postAction'

const CommentCard = ({ comment, post }) => {
  const editRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [onEdit, setOnEdit] = useState(false)
  const [openReply, setOpenReply] = useState(false)
  const [readMore, setReadMore] = useState(false)

  const myReact = useMemo(() => {
    return comment?.reacts?.find(item => item?.userId === user?.id)
  }, [comment, user?.id])

  //update comment
  const handleUpdateComment = () => {
    if (
      editRef?.current?.value &&
      editRef.current?.value?.trim() &&
      editRef.current?.value?.trim() !== comment.value
    ) {
      dispatch(
        updateComment({
          commentId: comment?.id,
          postId: post?.id,
          content: editRef.current?.value?.trim()
        })
      )
      setOnEdit(false)
    }
  }

  //react comment
  const handleReactComment = type => {
    dispatch(reactComment(comment, post?.id, type))
  }

  // unreact comment

  const handleUnReactComment = () => {
    dispatch(unReactComment(comment, post?.id))
  }

  // delete comment
  const handleDelete = () => {
    dispatch(deleteCommentAction(comment?.id, post?.id))
  }

  return (
    <div
      className={`my-2 ${
        !comment.id && 'opacity-30 pointer-events-none'
      } group ${comment.updating ? 'opacity-40 pointer-events-none' : ''}`}
    >
      <div className='flex gap-1 pb-1'>
        <Avatar
          src={comment.sender?.avatar?.url ?? defaulAvatar}
          size={25}
          onClick={() => navigate('/profile/' + comment.sender?.id)}
        />
        <p className=' translate-y-[-3px]  capitalize'>
          <span
            className='cursor-pointer  hover:underline'
            onClick={() => navigate('/profile/' + comment.sender?.id)}
          >
            {comment.sender?.firstname + ' ' + comment.sender?.lastname}
          </span>
          <span className='text-gray-400 text-[13px] font-[300] '>
            {' '}
            {moment(comment.createdAt).fromNow()}
          </span>
        </p>
      </div>
      <div className=' mt-[1px] p-2 w-full rounded-b-md rounded-tr-md bg-gray-200 min-h-[30px] flex items-center justify-between gap-2'>
        {onEdit ? (
          <div className='w-[calc(100%-30px)]'>
            <textarea
              rows={2}
              ref={editRef}
              contentEditable
              name=''
              id=''
              className=' w-full outline-none p-2 resize-none bg-transparent'
            ></textarea>

            <div className='flex justify-end gap-4 text-[14px]  '>
              <span
                className='text-red-400 cursor-pointer'
                onClick={() => {
                  setOnEdit(false)
                }}
              >
                cancel
              </span>
              <span
                className=' cursor-pointer text-green-500'
                onClick={handleUpdateComment}
              >
                update
              </span>
            </div>
          </div>
        ) : (
          <div className='w-[calc(100%-30px)]'>
            <p>
              {comment.receiverId && comment.receiverId !== comment.senderId ? (
                <span>
                  @
                  <span
                    className='hover:underline mr-1 cursor-pointer capitalize'
                    onClick={() => navigate(`/profile/${comment.tag._id}`)}
                  >
                    {comment.receiver.firstname +
                      ' ' +
                      comment.receiver.lastname}
                  </span>
                </span>
              ) : (
                ''
              )}
              {comment.content.length > 45 && !readMore
                ? comment.content.slice(0, 45)
                : comment.content}
              {comment.content.length > 45 ? (
                readMore ? (
                  <span
                    className='text-red-500 cursor-pointer'
                    onClick={() => setReadMore(false)}
                  >
                    hidden
                  </span>
                ) : (
                  <span
                    className='text-red-500 cursor-pointer'
                    onClick={() => setReadMore(true)}
                  >
                    ...read more
                  </span>
                )
              ) : (
                ''
              )}
            </p>
            <div className='flex items-center gap-7 text-[12px] mt-1'>
              <div className='flex gap-1 items-center'>
                {myReact?.type === 'like' ? (
                  <BiSolidLike
                    className='!cursor-pointer'
                    onClick={handleUnReactComment}
                  />
                ) : (
                  <Tooltip title='Like' placement='bottomRight'>
                    <BiLike
                      className='!cursor-pointer'
                      onClick={() => {
                        handleReactComment('like')
                      }}
                    />
                  </Tooltip>
                )}
                <span className='text-sm text-gray-400'>
                  {comment?.reacts?.filter(item => item?.type === 'like')
                    ?.length > 0 &&
                    comment?.reacts?.filter(item => item?.type === 'like')
                      ?.length}
                </span>
              </div>
              <div className='flex gap-1 items-center'>
                {myReact?.type === 'dislike' ? (
                  <BiSolidDislike
                    className='!cursor-pointer'
                    onClick={handleUnReactComment}
                  />
                ) : (
                  <Tooltip title='Dislike' placement='bottomLeft'>
                    <BiDislike
                      className='!cursor-pointer'
                      onClick={() => {
                        handleReactComment('dislike')
                      }}
                    />
                  </Tooltip>
                )}
                <span className='text-sm text-gray-400'>
                  {' '}
                  {comment?.reacts?.filter(item => item?.type === 'dislike')
                    ?.length > 0 &&
                    comment?.reacts?.filter(item => item?.type === 'dislike')
                      ?.length}
                </span>
              </div>

              <p className='font-[500]'>
                {/* {comment.likes.length} <span>likes</span> */}
              </p>
              <Button
                size='small'
                // className='font-[500] cursor-pointer'
                onClick={() => {
                  setOpenReply(!openReply)
                }}
                type={'link'}
                danger={openReply}
                className={openReply ? 'text-red-400 ' : ''}
              >
                <span className='text-sm'>
                  {' '}
                  {openReply ? 'Cancel' : 'Reply'}
                </span>
              </Button>
            </div>
          </div>
        )}
        {/* <div className='flex justify-end gap-2 w-[50px]'> */}
        <div className='hidden  group-hover:block'>
          {comment.senderId === user?.id ? (
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <div
                        onClick={() => {
                          setOnEdit(true)
                          setTimeout(() => {
                            if (editRef.current)
                              editRef.current.value = comment.content
                            editRef.current?.focus()
                          }, 100)
                        }}
                      >
                        <CiEdit /> Edit Comment
                      </div>
                    ),
                    key: '0'
                  },
                  {
                    label: (
                      <div onClick={handleDelete}>
                        <MdDeleteOutline /> Remove Comment
                      </div>
                    ),
                    key: '1'
                  }
                ]
              }}
            >
              <AiOutlineMore size={18} className='cursor-pointer' />
            </Dropdown>
          ) : post?.userId === user.id ? (
            <Dropdown
              menu={{
                items: [
                  {
                    label: (
                      <div onClick={handleDelete}>
                        <MdDeleteOutline /> Remove Comment
                      </div>
                    ),
                    key: '1'
                  }
                ]
              }}
            >
              <AiOutlineMore size={18} className='cursor-pointer' />
            </Dropdown>
          ) : (
            ''
          )}
        </div>
      </div>
      {openReply && (
        <InputComment post={post} comment={comment} setOpen={setOpenReply} />
      )}
    </div>
  )
}

export default CommentCard
