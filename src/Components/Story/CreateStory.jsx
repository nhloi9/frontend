import { Avatar, Button, Input, Progress, Tooltip } from 'antd'
import axios from 'axios'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaPause, FaPlay, FaVolumeDown, FaVolumeMute } from 'react-icons/fa'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { FiPlusCircle } from 'react-icons/fi'
import { LuMusic } from 'react-icons/lu'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { HiOutlineRefresh } from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { CgPushChevronRight, CgPushChevronUp } from 'react-icons/cg'
import { upload } from '../../utils/imageUpload'
import { postApi } from '../../network/api'
import { globalTypes } from '../../Reduxs/Types/globalType'
import { useNavigate } from 'react-router-dom'
import { storyTypes } from '../../Reduxs/Types/storyType'

const request = axios.create({
  baseURL: 'https://deezerdevs-deezer.p.rapidapi.com/',
  timeout: 10000,
  headers: {
    'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
    'x-rapidapi-key': 'd5fceae384msh08ad0dba50031c7p10982ejsn7f6ae044ce8a'
  }
})

const CreateStory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const [myvideo, setMyvideo] = useState(null)
  const myvideoRef = useRef()
  const [listSongs, setListSongs] = useState([])
  const [selectSong, setSelectSong] = useState(null)
  const [playMyvieo, setPlayMyvideo] = useState(false)
  const [activeSong, setActiveSong] = useState(null)
  let audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [percent, setPercent] = useState(0)
  const [texts, setTexts] = useState([])

  const handleSelectVideo = e => {
    try {
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = function () {
        // window.URL.revokeObjectURL(video.src);
        var duration = video.duration
        if (duration < 10 || duration > 120) {
          toast.error(
            'Duration of video must be greater than 10s and less than 2 minutes.'
          )
        } else {
          setMyvideo(e.target.files[0])
        }
      }
      video.src = URL.createObjectURL(e.target.files[0])
    } catch (error) {}
  }

  const previewUrl = useMemo(() => {
    return myvideo ? URL.createObjectURL(myvideo) : null
  }, [myvideo])

  const onSearchMusic = async value => {
    if (!value) return setListSongs([])
    setListSongs([])
    try {
      const res = await request.get(`search?q=${value}`)
      setListSongs(res.data?.data)
    } catch (error) {
      setListSongs([])
    }
  }
  useEffect(() => {
    if (playMyvieo) {
      audioRef?.current?.play()
    } else {
      audioRef?.current?.pause()
    }
  }, [playMyvieo])

  useEffect(() => {
    if (!myvideo) {
      setPlayMyvideo(false)
    }
  }, [myvideo])
  useEffect(() => {
    setPercent(0)
    setMuted(false)
  }, [myvideo])

  const refresh = () => {
    myvideoRef.current?.seekTo(0, 'seconds')
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const handlePostStory = async () => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: true
        }
      })
      const [file] = await upload([myvideo])

      const contentedTexts = texts.filter(
        text =>
          document.getElementById(text?.id) &&
          document.getElementById(text?.id)?.innerText &&
          document.getElementById(text.id)?.innerText?.trim().length > 0
      )

      const {
        data: { story }
      } = await postApi('/stories', {
        file,
        mutedOriginal: muted,
        song: selectSong,
        texts: contentedTexts.map(item => ({
          x: item.clientX / 172 ?? 0,
          y: item.clientY / 210 ?? 0,
          content: document.getElementById(item?.id)?.innerText?.trim() || ''
        }))
      })

      dispatch({
        type: globalTypes.ALERT,
        payload: {
          success: 'Create story successfully'
        }
      })
      dispatch({
        type: storyTypes.CREATE_STORY_SUCCESS,
        payload: story
      })
      navigate('/stories')
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          error
        }
      })
    }
  }

  useEffect(() => {
    setMuted(false)
  }, [myvideo])

  useEffect(() => {
    if (!selectSong) {
      setMuted(false)
    }
  }, [selectSong])

  useEffect(() => {
    if (selectSong && playMyvieo) {
      audioRef.current?.play()
    }
  }, [selectSong, playMyvieo])

  return (
    <div className='flex create-story'>
      {myvideo && selectSong && (
        <audio
          loop={true}
          autoPlay={false}
          ref={audioRef}
          // controls
          className='hidden'
          crossOrigin='anonymous'
          src={selectSong?.preview}
        />
      )}
      <div className='hidden md:block w-[300px] shadow-lg bg-white h-screen pt-[60px] px-2'>
        <div className='border-y-[1px] border-gray-300'>
          <h1 className='!font-[900] text-[24px] my-4'>Your Story</h1>

          <div
            className={`flex px-1 rounded-md gap-2 items-center py-1 mb-2 cursor-pointer`}
          >
            <div className='!my-auto rounded-full border-[3px] border-blue-600 shadow mb-4'>
              <div className='rounded-full border-[3px] border-gray-100 shadow'>
                <Avatar
                  size={'large'}
                  src={user?.avatar?.url}
                  className='shadow'
                />
              </div>
            </div>
            <div className='flex flex-col justify-center'>
              <h1 className='text-[17px] text-gray-500'>
                {user?.firstname + ' ' + user?.lastname}
              </h1>
              <p>Admin</p>
            </div>
          </div>
        </div>
      </div>
      <div className='w-full lg:w-[calc(100vw-300px)] bg-gray-100 h-screen pt-[60px] flex  justify-center '>
        <div className='w-[49%] flex flex-col items-center  '>
          <div className='relative w-[220px] h-[330px] mt-8'>
            {
              //   input text to story
              myvideo && (
                <div className='z-20 absolute rounded-md  w-[180px] px-1 pt-1 pb-4  h-[230px] top-[50px] left-1 bg-transparent  hover:bg-[#0000004b]'>
                  <Tooltip color='cyan' title='Add text'>
                    <div
                      className='w-full h-full  rounded-md  relative cursor-pointer text-white  '
                      onClick={e => {
                        const contentedTexts = texts.filter(
                          text =>
                            document.getElementById(text.id) &&
                            document.getElementById(text.id)?.innerText &&
                            document.getElementById(text.id)?.innerText?.trim()
                              .length > 0
                        )
                        setTexts(contentedTexts)

                        const newText = {
                          clientX:
                            e.clientX - e.target.getBoundingClientRect().left,
                          clientY:
                            e.clientY - e.target.getBoundingClientRect().top,
                          id: (Math.random() * 1e9).toString().slice(0, 5)
                        }
                        setTexts(pre => [...pre, newText])
                        setTimeout(() => {
                          document.getElementById(newText.id) &&
                            document.getElementById(newText.id)?.focus()
                        }, 100)
                      }}
                    >
                      {texts.map(text => (
                        <span
                          key={text.id}
                          contentEditable
                          onClick={e => {
                            e.stopPropagation()
                          }}
                          style={{
                            top: `${text.clientY}px`,

                            maxWidth: `${172 - text.clientX}px`,
                            maxHeight: `${216 - text.clientY}px`,
                            // width: `min-`,
                            left: `${text.clientX}px`,
                            textShadow: '1px 1px #FF0000'
                          }}
                          type='text'
                          id={text.id}
                          className={`drop-shadow-2xl font-sevil text-[14px] italic absolute outline-none min-h-[15px] px-[1px]   hover:overflow-y-scroll scroll-min  overflow-hidden   `}
                        />
                      ))}
                    </div>
                  </Tooltip>
                </div>
              )
            }
            {myvideo && (
              <div className='w-full px-3 absolute  -top-1 left-0 shadow-lg'>
                <Progress
                  percent={percent * 100}
                  showInfo={false}
                  size={'small'}
                />
              </div>
            )}
            {myvideo && (
              <div className='absolute z-20 top-5 w-full flex justify-between  items-center px-3 gap-2'>
                <div>
                  <Tooltip title='Remove this video' color='red'>
                    <IoMdCloseCircleOutline
                      onClick={() => {
                        setMyvideo(null)
                      }}
                      size={24}
                      className='!text-red-500 shadow-lg cursor-pointer !font-[800]'
                    />
                  </Tooltip>
                </div>
                <div className='flex gap-2 items-center'>
                  <Tooltip title='Replay' color='blue'>
                    <HiOutlineRefresh
                      onClick={() => {
                        refresh()
                        setPlayMyvideo(true)
                      }}
                      size={24}
                      className='!text-white shadow-lg cursor-pointer !font-[800]'
                    />
                  </Tooltip>
                  {selectSong &&
                    (muted ? (
                      <Tooltip color='blue' title='Turn on the original sound'>
                        <FaVolumeMute
                          onClick={() => {
                            setMuted(false)
                          }}
                          size={24}
                          className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip color='red' title='Turn off the original sound'>
                        <FaVolumeDown
                          onClick={() => {
                            setMuted(true)
                          }}
                          size={24}
                          className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                        />
                      </Tooltip>
                    ))}

                  {playMyvieo ? (
                    <FaPause
                      className='!text-gray-50 shadow-lg cursor-pointer !font-[800]  '
                      onClick={() => {
                        setPlayMyvideo(false)
                      }}
                      size={19}
                    />
                  ) : (
                    <FaPlay
                      className='!text-gray-50 shadow-lg cursor-pointer !font-[800] '
                      onClick={() => {
                        setPlayMyvideo(true)
                      }}
                      size={19}
                    />
                  )}
                </div>
              </div>
            )}
            {selectSong && (
              <div className='absolute z-20 bottom-2 w-full group'>
                <div
                  className={`w-full flex justify-center gap-1 ${
                    playMyvieo && 'animate-bounce'
                  }`}
                >
                  <p className='text-gray-100 text-sm text-center '>
                    <LuMusic
                      className='!text-gray-100 shadow-md translate-y-1'
                      size={20}
                    />{' '}
                    {selectSong.title_short} (
                    <span className='text-gray-300'>
                      {selectSong?.artist?.name?.length > 15
                        ? selectSong?.artist?.name?.slice(0, 15) + '...'
                        : selectSong?.artist?.name}
                      )
                    </span>
                  </p>
                </div>
                <div className='w-full  justify-center hidden group-hover:flex '>
                  <Tooltip color='red' title='Remove this song'>
                    <IoClose
                      color='red'
                      className='cursor-pointer'
                      onClick={() => {
                        setSelectSong(null)
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            )}
            {
              <Button
                onClick={handlePostStory}
                disabled={!myvideo}
                type='primary'
                className='absolute right-0  translate-x-[89px] top-[50%]'
              >
                Post <CgPushChevronRight className='!translate-y-[3px]' />
              </Button>
            }
            {!myvideo ? (
              <div
                className='w-[220px]  h-[330px] rounded-2xl flex items-center justify-center'
                style={{
                  backgroundImage:
                    'url(https://static.xx.fbcdn.net/rsrc.php/v3/ye/r/0_etHRYkr4X.png)'
                }}
              >
                <label htmlFor='input-story'>
                  <img
                    src='https://cdn-icons-png.flaticon.com/512/3159/3159331.png'
                    className='w-[30px] h-[30px] object-cover cursor-pointer'
                    alt=''
                  />
                </label>
                <input
                  accept='video/*'
                  type='file'
                  id='input-story'
                  className='hidden'
                  onChange={handleSelectVideo}
                />
              </div>
            ) : (
              <div className='w-[220px]  h-[330px] create-story-preview'>
                <ReactPlayer
                  ref={myvideoRef}
                  muted={muted}
                  // controls
                  loop={false}
                  onProgress={progress => {
                    setPercent(progress.played)
                  }}
                  onEnded={() => {
                    setPlayMyvideo(false)
                    setPercent(0)
                    refresh()
                  }}
                  // controls
                  playing={playMyvieo}
                  autoPlay={false}
                  url={previewUrl}
                  className='!w-full !h-full !object-cover'
                  // onEnded={handleNext}
                ></ReactPlayer>
              </div>
            )}
          </div>
          <div>
            <Input.Search
              className='w-[220xp] mt-4'
              placeholder='Add a music'
              onSearch={onSearchMusic}
              classNames={'!w-[220px]'}
            />
          </div>
          <br />
          <div className='w-[300px]'>
            {listSongs?.length > 0 && (
              <div className='bg-white w-full h-min max-h-[200px] song-card overflow-y-hidden hover:overflow-y-scroll px-1 py-1 rounded-md'>
                <h1 className='text-[18px] text-gray-800'>
                  Song{' '}
                  <span className='!text-sm !text-gray-600'>
                    ({listSongs.length} results found)
                  </span>
                </h1>
                {listSongs.map(song => (
                  <SongCard
                    song={song}
                    key={song?.id}
                    setSelectSong={setSelectSong}
                    activeSong={activeSong}
                    setActiveSong={setActiveSong}
                    refresh={refresh}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const SongCard = ({
  song,
  activeSong,
  setActiveSong,
  setSelectSong,
  refresh
  // currentSong,
  // setCurrentSong,
  // play
}) => {
  const [duration, setDuration] = useState(null)
  const songRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    // Additional logic when the video has ended
  }
  const handleAbort = () => {
    setIsPlaying(false)
    // Additional logic when the video has been aborted
  }

  useEffect(() => {
    if (activeSong?.id !== song.id) {
      songRef?.current?.pause()
    }
  }, [activeSong?.id, song?.id])

  const onLoadedMetadata = () => {
    if (songRef.current) {
      setDuration(Math.round(songRef.current?.duration))
    }
  }

  return (
    <div className='w-full group h-[60px] flex items-center relative justify-between hover:bg-gray-300 px-1 rounded-md '>
      <audio
        onLoadedMetadata={onLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onAbort={handleAbort}
        // loop={true}
        autoPlay={false}
        ref={songRef}
        //  controls
        className='hidden'
        crossOrigin='anonymous'
        src={song?.preview}
      />
      <div className=' flex gap-1 items-center  relative'>
        <img
          crossOrigin='anonymous'
          src={song.artist?.picture_medium}
          className='w-[40px] h-[40px] rounded-md object-cover'
          alt=''
        />
        <div className='absolute hidden group-hover:block left-3 top-3  cursor-pointer'>
          {!isPlaying && (
            <FaPlay
              className='!text-gray-600'
              onClick={() => {
                setActiveSong(song)
                songRef && songRef.current && songRef.current.play()
              }}
            />
          )}
        </div>

        {isPlaying && (
          <div
            className='absolute left-1 top-3  cursor-pointer'
            onClick={() => {
              songRef && songRef.current && songRef.current.pause()
            }}
          >
            (
            <img
              className='w-[20px] h-[20px] object-contain'
              alt=''
              src='https://zmp3-static.zmdcdn.me/skins/zmp3-v6.1/images/icons/icon-playing.gif'
            ></img>
            )
          </div>
        )}
        <div className='flex flex-col'>
          <p className='text-gray-700 text-sm font-[600]'>
            {song?.title_short
              ? song?.title_short?.length > 25
                ? song?.title_short?.slice(0, 25) + '...'
                : song?.title_short
              : 'Song'}
          </p>
          <p className='text-sm text-gray-500'>
            {song?.artist?.name
              ? song?.artist?.name?.length > 25
                ? song?.artist?.name?.slice(0, 25) + '...'
                : song?.artist?.name
              : 'Artist'}
          </p>
        </div>
      </div>
      {duration && (
        <p className='text-sm text-gray-500'>
          {String(Math.floor(duration / 60)).padStart(2, '0')}:
          {String(duration - Math.floor(duration / 60) * 60).padStart(2, '0')}
        </p>
      )}
      <div className='absolute hidden group-hover:block right-9 top-[19px]  cursor-pointer'>
        <Tooltip title='Add this audio' color='blue'>
          {
            <FiPlusCircle
              size={20}
              color='blue'
              onClick={() => {
                setSelectSong(song)
                refresh()
              }}
            />
          }
        </Tooltip>
      </div>
    </div>
  )
}

export default CreateStory
