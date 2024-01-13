import { Avatar, Dropdown, Popover, Space } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { CiEdit } from 'react-icons/ci'
import moment from 'moment'
import { MdDeleteOutline, MdOutlinePublic } from 'react-icons/md'
import { FaLock, FaRegCopy } from 'react-icons/fa'
import { IoIosMore } from 'react-icons/io'
import CreatePost from '../Home/CreatePost'

const CardHeader = ({ post, type, disableEdit }) => {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const [openEditPost, setOpenEditPost] = useState(false)
  const editPost = () => {
    setOpenEditPost(true)
  }

  const handleDeletePost = () => {}

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/post/${post.id}`)
    window.alert(`Copied `)
  }

  return (
    <div className='p-4'>
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
      <div className=' flex justify-between items-center'>
        <div className='flex gap-1  w-[calc(100%-20px)]'>
          <Link to={`/profile/${post.user?.id}`} className=''>
            <Avatar src={post.user?.avatar?.url} size={'large'} />
          </Link>

          <div className='ml-2 w-[cacl(100%-50px)]'>
            <span className=''>
              <Link
                to={`/profile/${post?.user?.id}`}
                className='text-black !no-underline'
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
            {user?.id === post?.user?.id ? (
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
            )}
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
    </div>
  )
}

export default CardHeader
