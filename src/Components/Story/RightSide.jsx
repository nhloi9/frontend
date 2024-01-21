import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { Avatar, Button, Input, Progress, Tooltip } from 'antd'
import { Comment as CommentAntd } from '@ant-design/compatible'
import { BiSolidSend } from 'react-icons/bi'
import { MdOutlineComment } from 'react-icons/md'
import millify from 'millify'
import { IoMdClose } from 'react-icons/io'
import { CiStar } from 'react-icons/ci'
// import  ShowReacts from '../PostCard/C'

import {
  FaGooglePlay,
  FaPause,
  FaPlay,
  FaVolumeDown,
  FaVolumeMute
} from 'react-icons/fa'
import SwipeableViews from 'react-swipeable-views'
import { FcNext, FcPrevious } from 'react-icons/fc'
import { defaulAvatar, reacts } from '../../Constants'
import { LuMusic } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { commentStory, reactStory } from '../../Reduxs/Actions/storyAction'
import moment from 'moment'
import ShowReacts from '../PostCard/ShowReacts'

const RightSide = ({ current, stories, setCurrent, type }) => {
  const [openShowReacts, setOpenShowReacts] = useState(false)
  const [percent, setPercent] = useState(0)
  const [play, setPlay] = useState(true)
  const [muted, setMuted] = useState(false)
  let audioRef = useRef(null)
  const navigate = useNavigate()
  const [openComment, setOpenComment] = useState(false)
  const [inputComment, setInputComment] = useState('')
  const dispatch = useDispatch()
  const inputCommentRef = useRef()

  useEffect(() => {}, [current])

  const handleNext = () => {
    if (current < stories.length - 1) {
      setCurrent(current + 1)
    } else if (type === 'profile') {
      navigate('/profile/' + stories[0]?.user?.id)
    } else {
      navigate('/')
    }
  }

  const handlePre = () => {
    setCurrent(Math.max(current - 1, 0))
  }

  const story = useMemo(() => {
    if (current !== undefined && current !== null) {
      return stories[current]
    } else return null
  }, [current, stories])

  const topRates = useMemo(() => {
    if (story) return caculateTopReacts(story.reacts)
    else {
      return []
    }
  }, [story])
  useEffect(() => {
    setOpenComment(false)
    setPercent(0)
    setPlay(true)
    // setMuted(false)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [current])

  useEffect(() => {
    if (play) {
      audioRef?.current?.play()
    } else {
      audioRef?.current?.pause()
    }
  }, [play])

  return (
    <div className=' w-full  md:w-[calc(100vw-300px)] relative h-screen pt-[60px] flex justify-center items-center bg-black '>
      {story && (
        <>
          <div className=' react-story absolute bottom-3 w-full h-[50px] flex justify-center gap-2 items-center'>
            <div className='relative'>
              <input
                ref={inputCommentRef}
                value={inputComment}
                placeholder='Reply...'
                onChange={e => {
                  setInputComment(e.target.value)
                }}
                variant='filled'
                className='peer px-3 py-[5px] bg-black border border-blue-500 outline-none focus:outline-none w-[300px] rounded-2xl !text-white placeholder:text-gray-200  '
                // lg:focus:w-[500px] focus:pr-[40px]
              />
              <div className=' absolute block top-[6px] right-2 text-white cursor-pointer'>
                <BiSolidSend
                  size={20}
                  onClick={e => {
                    // e.preventDefault()
                    inputCommentRef.current?.focus()
                    inputComment?.length > 0 &&
                      dispatch(commentStory(story?.id, inputComment))
                    setInputComment('')
                  }}
                />
              </div>
            </div>
            <SwipeableViews>
              <div className='  flex h-[40px]  items-center px-1   gap-3  '>
                {reacts.map((react, index) => (
                  <img
                    key={index}
                    src={react.icon}
                    alt=''
                    className={`w-[25px] h-[25px] rounded-full hover:scale-125  hover:animate-none cursor-pointer `}
                    onClick={() => {
                      dispatch(reactStory(story?.id, react.id))
                    }}
                  />
                ))}
              </div>
            </SwipeableViews>
          </div>
          {story.song && (
            <audio
              muted={muted}
              loop={true}
              autoPlay={true}
              ref={audioRef}
              // controls
              className='hidden'
              crossOrigin='anonymous'
              src={story?.song?.preview}
            />
          )}
          <div className='w-[300px] h-[80%] relative story-video rounded-lg'>
            {story?.song && (
              <div className='absolute z-20 bottom-2 w-full group'>
                <div
                  className={`w-full flex justify-center gap-1 ${
                    play && 'animate-bounce'
                  }`}
                >
                  <p className='text-gray-100 text-center '>
                    <LuMusic
                      className='!text-gray-100  translate-y-1'
                      size={20}
                    />{' '}
                    {story?.song?.title_short} (
                    <span className='text-gray-300'>
                      {story?.song?.artist?.name?.length > 15
                        ? story?.song?.artist?.name?.slice(0, 15) + '...'
                        : story?.song?.artist?.name}
                      )
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* texts */}
            <div className='z-20 rounded-md absolute w-[255px] px-1 h-[360px] top-[70px] left-1 bg-transparent  pt-1 pb-4  hover:bg-[#0000004e]  '>
              <div className=' w-full h-full  relative cursor-pointer text-white '>
                {story?.texts?.map(text => (
                  <span
                    key={text.id}
                    style={{
                      top: `${text?.y * 340}px`,

                      maxWidth: `${247 - text?.x * 247}px`,
                      maxHeight: `${340 - text?.y * 340}px`,
                      // width: `min-`,
                      left: `${text?.x * 247}px`,
                      textShadow: '1px 1px #FF0000'
                    }}
                    type='text'
                    id={text.id}
                    className={`drop-shadow-2xl text-white font-sevil text-[14px] italic absolute outline-none  px-[1px]   hover:overflow-y-scroll scroll-min  overflow-hidden   `}
                  >
                    {text?.content}
                  </span>
                ))}
              </div>
            </div>

            <ReactPlayer
              muted={story?.mutedOriginal ? true : muted}
              loop={false}
              onProgress={progress => {
                setPercent(progress.played)
              }}
              // controls
              playing={play}
              autoPlay
              url={story.video.url}
              className='!w-full !h-full !object-cover'
              onEnded={handleNext}
            ></ReactPlayer>

            <div className='w-full px-3 absolute  top-0 left-0 '>
              <Progress
                percent={percent * 100}
                showInfo={false}
                size={'small'}
              />
            </div>
            <div className='absolute top-7 w-full flex justify-between px-3'>
              <div className='flex gap-1 items-center'>
                <Avatar
                  src={story.user?.avatar?.url ?? defaulAvatar}
                  size={'default'}
                  className=' cursor-pointer'
                  onClick={() => navigate('/profile/' + story?.user?.id)}
                />
                <h1
                  className='text-white cursor-pointer hover:underline '
                  onClick={() => navigate('/profile/' + story?.user?.id)}
                >
                  {story?.user?.firstname + ' ' + story?.user?.lastname}
                </h1>
              </div>
              <div className='flex gap-2 items-center'>
                {play ? (
                  <FaPause
                    className='!text-gray-50  cursor-pointer !font-[800] '
                    onClick={() => {
                      if (percent < 0.99) setPlay(false)
                    }}
                    size={19}
                  />
                ) : (
                  <FaPlay
                    className='!text-gray-50  cursor-pointer !font-[800] '
                    onClick={() => {
                      if (percent < 0.99) setPlay(true)
                    }}
                    size={19}
                  />
                )}
                {muted ? (
                  <FaVolumeMute
                    onClick={() => {
                      setMuted(false)
                    }}
                    size={24}
                    className='!text-gray-50  cursor-pointer !font-[800] '
                  />
                ) : (
                  <FaVolumeDown
                    onClick={() => {
                      setMuted(true)
                    }}
                    size={24}
                    className='!text-gray-50  cursor-pointer !font-[800] '
                  />
                )}
              </div>
            </div>
            <div className='absolute right-4 top-[200px]'>
              <div className='flex flex-col gap-5'>
                <div
                  className={`!text-white  flex flex-col items-center ${
                    topRates.length === 0 && 'opacity-0'
                  }`}
                >
                  <div
                    className={` ${
                      topRates.length > 1 && 'relative'
                    } cursor-pointer`}
                    onClick={() => setOpenShowReacts(true)}
                  >
                    {topRates.map((react, index) => (
                      <img
                        key={index}
                        src={react.icon}
                        alt=''
                        className={`w-[18px] h-[18px] rounded-full  hover:animate-none ${
                          topRates.length > 1 &&
                          (index === 0
                            ? 'absolute z-10 top-0'
                            : '-translate-y-3')
                        }`}
                        onClick={() => {
                          dispatch(reactStory(story?.id, react.id))
                        }}
                      />
                    ))}
                  </div>
                  <p>{millify(story.reacts?.length ?? 0)}</p>
                </div>

                <div className='!text-white  flex flex-col items-center'>
                  <MdOutlineComment
                    size={22}
                    className='!shadow-md cursor-pointer'
                    onClick={() => {
                      setOpenComment(true)
                    }}
                  />
                  <p>{millify(story.comments?.length ?? 0)}</p>
                </div>
              </div>
            </div>
            {openComment && (
              <Comments
                onCancle={() => {
                  setOpenComment(false)
                }}
                comments={story.comments ?? []}
              />
            )}
            {openShowReacts && (
              <ShowReacts
                reactsArray={story?.reacts}
                open={openShowReacts}
                onCancel={() => {
                  setOpenShowReacts(false)
                }}
              />
            )}
          </div>
          {current > 0 && (
            <div
              className='absolute flex justify-center items-center top-[50%] left-2 md:left-[20%] !rounded-full !w-14 !h-14 bg-[#999999] shadow cursor-pointer hover:bg-gray-50'
              onClick={handlePre}
            >
              <FcPrevious size={20} color='gray' />
            </div>
          )}
          {current < stories.length - 1 && (
            <div
              className='absolute flex justify-center items-center top-[50%] right-2 md:right-[20%] !rounded-full !w-14 !h-14 bg-[#999999] shadow cursor-pointer hover:bg-gray-50'
              onClick={handleNext}
            >
              <FcNext size={20} color='gray' />
            </div>
          )}
        </>
      )}
      {stories.length > 0 && (current === null || current === undefined) && (
        <div className='w-[300px] h-[80%] bg-gray-600 flex items-center justify-center story-video rounded-lg'>
          <p
            className='text-white cursor-pointer'
            onClick={() => {
              setCurrent(0)
            }}
          >
            Click to view stories
          </p>
        </div>
      )}
      {stories.length === 0 && (
        <div className='w-[300px] h-[80%] bg-gray-600 flex items-center justify-center story-video rounded-lg'>
          <p className='text-white '>There are no stories</p>
        </div>
      )}
    </div>
  )
}

const Comments = ({ comments, onCancle }) => {
  return (
    <div className='absolute z-30 top-[30%] w-full h-[70%] bg-white'>
      <div className='flex justify-between px-1 py-2 bg-gray-200'>
        <div className='flex gap-1 bg-gray-200'>
          <h1>Comment</h1>
          <span>{millify(comments?.length || 0)}</span>
        </div>
        <IoMdClose className='cursor-pointer' onClick={onCancle} />
      </div>
      <div className='w-full h-[calc(100%-40px)] p-1 overflow-y-scroll scroll-min'>
        <div className='bg-gray-200 flex flex-col gap-[1px]'>
          {comments.map(comment => (
            // <div className='flex py-1 gap-1'>
            //   <Avatar
            //     src={comment?.user?.avatar?.url ?? defaulAvatar}
            //     size={'small'}
            //   />
            //   <div className='w-[calc(100%-35px)]'>
            //     <p className='text-sm font-[500] text-gray-900'>
            //       {comment?.user?.firstname + ' ' + comment?.user?.lastname}
            //     </p>
            //     <p className='text-sm'>{comment?.content}</p>
            //   </div>
            // </div>
            <CommentAntd
              // actions={actions}
              author={
                <a href='j'>
                  {comment?.user?.firstname + ' ' + comment?.user?.lastname}
                </a>
              }
              avatar={
                <Avatar
                  src={comment?.user?.avatar?.url ?? defaulAvatar}
                  alt={comment?.user?.firstname + ' ' + comment?.user?.lastname}
                />
              }
              content={comment.content}
              datetime={
                <Tooltip title='2016-11-22 11:22:33'>
                  <span>{moment(comment?.createdAt).fromNow()}</span>
                </Tooltip>
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function caculateTopReacts (reactsArray) {
  let reactsTop = {}
  reactsArray.forEach(item => {
    if (reactsTop[item?.react?.id]) {
      reactsTop[item?.react?.id] += 1
    } else reactsTop[item?.react?.id] = 1
  })

  let reactsTopSorted = Object.keys(reactsTop).sort((a, b) => {
    return reactsArray[b] - reactsTop[a]
  })
  if (reactsTopSorted.length > 2) {
    reactsTopSorted = reactsTopSorted.slice(0, 1)
  }
  const returns = reactsTopSorted.map(item =>
    reacts.find(i => i.id.toString() === item)
  )
  return returns
}

export default RightSide
