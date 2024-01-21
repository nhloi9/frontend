import { Button, Dropdown, Modal, Popover, Space } from 'antd'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { CiEdit } from 'react-icons/ci'
import { LuCheck } from 'react-icons/lu'
import moment from 'moment'
import {
  MdArrowForwardIos,
  MdDeleteOutline,
  MdOutlinePublic
} from 'react-icons/md'
import { FaLock, FaRegCopy } from 'react-icons/fa'
import { IoIosMore } from 'react-icons/io'
import CreatePost from '../Home/CreatePost'
import { TbMessageReport } from 'react-icons/tb'
import { postApi } from '../../network/api'
import Avatar from '../Home/Avatar'
import { baseUrl, defaulAvatar } from '../../Constants'
import { globalTypes } from '../../Reduxs/Types/globalType'
import { deletePost } from '../../Reduxs/Actions/postAction'
import toast from 'react-hot-toast'

const CardHeader = ({ post, type, disableEdit }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const [openReport, setOpenReport] = useState(false)
  const [openEditPost, setOpenEditPost] = useState(false)
  const editPost = () => {
    setOpenEditPost(true)
  }

  const handleDeletePost = () => {
    dispatch(deletePost(post?.id))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(baseUrl + `/post/${post.id}`)
    toast.success(`Copied `)
  }

  return (
    <div className='p-4 pb-2'>
      {post?.group && type !== 'detailGroup' && (
        <div>
          <div className='my-3 flex gap-1 '>
            <span className='text-gray-500'>Post in </span>
            <Popover
              content={
                <div
                  className='flex items-center gap-2 cursor-pointer'
                  onClick={() => navigate('/groups/' + post?.group?.id)}
                >
                  <img
                    src={post?.group?.image?.url}
                    alt=''
                    className='w-14 h-14 rounded-md object-cover'
                  />
                  <div className='flex flex-col justify-center'>
                    <span className='font-bold'>{post?.group?.name}</span>
                    <div>
                      <span className='text-gray-500 text-sm'>
                        <span>
                          {post?.group?.privacy === 'public' ? (
                            <MdOutlinePublic className='!translate-y-[3px]' />
                          ) : (
                            <FaLock className='!translate-y-[3px]' />
                          )}
                        </span>
                        {' ' + post?.group?.privacy + ' group'}
                      </span>
                    </div>
                  </div>
                </div>
              }
              title=''
            >
              <span
                className='font-bold hover:underline cursor-pointer text-black'
                onClick={() => navigate('/groups/' + post?.group?.id)}
              >
                {post?.group?.name}
              </span>
            </Popover>
          </div>
          <hr className='h-[1px] mb-3 bg-gray-300' />
        </div>
      )}
      <div className=' flex justify-between items-start'>
        <div className='flex gap-1  w-[calc(100%-30px)]'>
          <Link to={`/profile/${post.user?.id}`} className=''>
            <Avatar src={post.user?.avatar?.url ?? defaulAvatar} size={40} />
          </Link>

          <div className='ml-2 w-[cacl(100%-60px)]'>
            <span className=''>
              <Link
                to={`/profile/${post?.user?.id}`}
                className='text-black hover:text-black hover:underline no-underline'
              >
                <span className='font-[500]  capitalize'>
                  {post?.user?.firstname + ' ' + post?.user?.lastname}
                </span>
              </Link>
              <span className='text-gray-600'>
                {' '}
                {post?.feel &&
                  post?.feel?.icon + ' feeling ' + post?.feel?.name}{' '}
                {post?.tags?.length > 0 && (
                  <span>
                    with{' '}
                    <span>
                      {post?.tags?.map((friend, index, arr) => {
                        // const friend = friends.find(i => i?.id === friendId)
                        if (index === 0)
                          return (
                            <span
                              className='text-black ml-[1px] cursor-pointer hover:underline'
                              onClick={() => navigate('/profile/' + friend?.id)}
                            >
                              {friend?.firstname + ' ' + friend.lastname}
                            </span>
                          )
                        else if (index === arr.length - 1)
                          return (
                            <span>
                              {' '}
                              and
                              <span
                                className='text-black cursor-pointer hover:underline'
                                onClick={() =>
                                  navigate('/profile/' + friend?.id)
                                }
                              >
                                {' '}
                                {friend?.firstname + ' ' + friend.lastname}
                              </span>
                            </span>
                          )
                        else
                          return (
                            <span>
                              ,
                              <span
                                className='text-black cursor-pointer hover:underline'
                                onClick={() =>
                                  navigate('/profile/' + friend?.id)
                                }
                              >
                                {' '}
                                {friend?.firstname + ' ' + friend.lastname}
                              </span>
                            </span>
                          )
                      })}
                    </span>
                  </span>
                )}
                {post?.location && (
                  <span>
                    {' '}
                    at{' '}
                    <span
                      className='text-black cursor-pointer hover:underline'
                      onClick={() => {
                        window.open(
                          'https://maps.google.com?q=' +
                            post?.location?.lat +
                            ',' +
                            post?.location.lng
                        )
                      }}
                    >
                      {post?.location?.name}
                    </span>
                  </span>
                )}
              </span>
            </span>
            <p className='text-gray-500 text-[14px] '>
              {moment(post.createdAt).fromNow()}
            </p>
          </div>
        </div>
        {!disableEdit && (
          <div>
            <Dropdown
              menu={{
                items: [
                  ...(!post.shareId && user?.id === post?.user?.id
                    ? [
                        {
                          label: (
                            <div
                              onClick={editPost}
                              className='flex items-center'
                            >
                              <CiEdit size='18px' /> &nbsp;Edit Post
                            </div>
                          ),
                          key: '0'
                        }
                      ]
                    : []),
                  ...(user?.id === post?.user.id || user?.role === 'admin'
                    ? [
                        {
                          label: (
                            <div
                              onClick={handleDeletePost}
                              className='flex items-center'
                            >
                              <MdDeleteOutline size='18px' />
                              &nbsp;Remove Post
                            </div>
                          ),
                          key: '1'
                        }
                      ]
                    : []),
                  ...(user?.id !== post?.user.id
                    ? [
                        {
                          label: (
                            <div
                              onClick={() => setOpenReport(true)}
                              className='flex items-center'
                            >
                              <TbMessageReport size='18px' />
                              &nbsp;Report post
                            </div>
                          ),
                          key: '2'
                        }
                      ]
                    : []),
                  {
                    label: (
                      <div onClick={handleCopy} className='flex items-center'>
                        <FaRegCopy size='18px' />
                        &nbsp;Copy Link
                      </div>
                    ),
                    key: '3'
                  }
                ]
              }}
              trigger={['click']}
              placement='bottomRight'
            >
              <Space>
                <IoIosMore fontSize='medium' className='cursor-pointer' />
              </Space>
            </Dropdown>

            {/* {user?.id === post?.user?.id ? (
              <Dropdown
                menu={{
                  items: [
                    ...(!post.shareId
                      ? [
                          {
                            label: (
                              <div
                                onClick={editPost}
                                className='flex items-center'
                              >
                                <CiEdit size='18px' /> &nbsp;Edit Post
                              </div>
                            ),
                            key: '0'
                          }
                        ]
                      : []),
                    {
                      label: (
                        <div
                          onClick={handleDeletePost}
                          className='flex items-center'
                        >
                          <MdDeleteOutline size='18px' />
                          &nbsp;Remove Post
                        </div>
                      ),
                      key: '1'
                    },
                    {
                      label: (
                        <div onClick={handleCopy} className='flex items-center'>
                          <FaRegCopy size='18px' />
                          &nbsp;Copy Link
                        </div>
                      ),
                      key: '2'
                    }
                  ]
                }}
                trigger={['click']}
                placement='bottomRight'
              >
                <Space>
                  <IoIosMore fontSize='medium' className='cursor-pointer' />
                </Space>
              </Dropdown>
            ) : (
              <Dropdown
                menu={{
                  items: [
                    {
                      label: (
                        <div onClick={handleCopy} className='flex items-center'>
                          <FaRegCopy size='18px' />
                          &nbsp;Copy Link
                        </div>
                      ),
                      key: '2'
                    },
                    ...(user?.role !== 'admin'
                      ? [
                          {
                            label: (
                              <div
                                onClick={() => setOpenReport(true)}
                                className='flex items-center'
                              >
                                <TbMessageReport size='18px' />
                                &nbsp;Report post
                              </div>
                            ),
                            key: '3'
                          }
                        ]
                      : [])
                  ]
                }}
                trigger={['click']}
                placement='bottomRight'
              >
                <Space>
                  <IoIosMore fontSize='medium' className='cursor-pointer' />
                </Space>
              </Dropdown>
            )} */}
          </div>
        )}
        {openEditPost && (
          <CreatePost
            open={openEditPost}
            setOpen={setOpenEditPost}
            post={post}
          />
        )}
      </div>
      {openReport && (
        <Report
          open={openReport}
          cancle={() => setOpenReport(false)}
          postId={post?.id}
        />
      )}
    </div>
  )
}

const reportTitles = [
  {
    value: 'violence',
    title: 'Violence'
  },
  {
    value: 'spam',
    title: 'Spam'
  },
  {
    value: 'harassment',
    title: 'Harassment'
  },
  {
    value: 'hate',
    title: 'Hate speech'
  },
  {
    value: 'nudity',
    title: 'Nudity'
  },
  {
    value: 'false',
    title: 'False information'
  },
  {
    value: 'terrorism',
    title: 'Terrorism'
  }
]

const Report = ({ open, cancle, postId }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const handleReport = async item => {
    try {
      setLoading(true)
      await postApi('/posts/' + postId + '/report', {
        type: item.value
      })
      setReport(item)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          error
        }
      })
    }
  }

  return (
    <>
      {!report ? (
        <Modal
          open={open}
          onCancel={cancle}
          title={<h1>Report</h1>}
          footer={[]}
        >
          <p className='font-[500]'>Please select a problem</p>
          {reportTitles.map((item, index) => (
            <div
              key={index}
              className='p-2 flex items-center justify-between cursor-pointer rounded-md hover:bg-gray-200'
              onClick={() => handleReport(item)}
            >
              <span>{item.title}</span>
              <MdArrowForwardIos className='!text-gray-400' />
            </div>
          ))}
        </Modal>
      ) : (
        <Modal
          open={open}
          onCancel={cancle}
          title={
            <div className='w-full text-center'>
              <p className='font-[500]'>Thanks for letting us know.</p>
            </div>
          }
          footer={[
            <Button className='!w-full' type='primary' onClick={cancle}>
              Done
            </Button>
          ]}
        >
          <hr className='h-[1px] bg-gray-400 w-full mb-3' />
          <div className='flex justify-center'>
            <div className='px-2 py-[1px] rounded-xl bg-blue-100'>
              <span className='!text-blue-600'>
                <LuCheck /> {report?.title}
              </span>
            </div>
          </div>
          <div className='text-center'>
            <span>
              We'll use this information to improve our processes. We may also
              use it to help us find and remove more spam.
            </span>
          </div>
          <hr className='h-[1px] bg-gray-400 w-full mb-3 mt-2' />
        </Modal>
      )}
    </>
  )
}

export default CardHeader
