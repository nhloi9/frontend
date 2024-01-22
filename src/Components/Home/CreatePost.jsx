import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button, Image, Input, Modal, Select, Tooltip } from 'antd'
import { FaCamera, FaUserFriends, FaUserTag } from 'react-icons/fa'
import { IoIosVideocam, IoMdClose } from 'react-icons/io'
import { toast } from 'react-hot-toast'
import { MdAddPhotoAlternate, MdPublic } from 'react-icons/md'
import axios from 'axios'
import { IoLocationSharp } from 'react-icons/io5'
import { GrLinkPrevious } from 'react-icons/gr'
import EmojiSelect from './EmojiSelect'
import { useDispatch, useSelector } from 'react-redux'
import { TiArrowSortedDown } from 'react-icons/ti'
import {
  createPostAction,
  updatePostAction
} from '../../Reduxs/Actions/postAction'
import {
  defaulAvatar,
  defaultVideoThumbnail,
  tomtomApiKey
} from '../../Constants'
import GoogleMapReact from 'google-map-react'
import { FaLocationDot } from 'react-icons/fa6'
import { BsEmojiSmile } from 'react-icons/bs'
import { MultiSelect } from 'react-multi-select-component'
import { AiOutlineEye } from 'react-icons/ai'
// import { use } from 'i18next'
import { generateVideoThumbnails } from '@rajesh896/video-thumbnails-generator'
import { BiSolidLockAlt } from 'react-icons/bi'
import { getApi } from '../../network/api'
// import { el } from 'date-fns/locale'

function dataURLtoFile (dataURL, filename = 'file') {
  const arr = dataURL.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch && mimeMatch.length >= 2 ? mimeMatch[1] : 'image/png'

  const byteString = atob(arr[1])
  const arrayBuffer = new ArrayBuffer(byteString.length)
  const uint8Array = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i)
  }

  const blob = new Blob([arrayBuffer], { type: mime })
  return new File([blob], filename, { type: mime })
}

const options = [
  {
    label: (
      <p className='!text-[13px]'>
        <BiSolidLockAlt className='!translate-y-[1px]' size={13} /> Only me
      </p>
    ),
    value: 'private'
  },
  {
    label: (
      <p className='!text-[13px]'>
        <FaUserFriends className='!translate-y-[1px]' size={13} /> Friends
      </p>
    ),
    value: 'friend'
  },
  {
    label: (
      <p className='!text-[13px]'>
        <MdPublic className='!translate-y-[1px]' size={13} /> Public
      </p>
    ),
    value: 'public'
  }
]

const ImgShow = ({ image }) => {
  // const src = useMemo(() => {
  //   return image?.url ? image?.url : URL.createObjectURL(image)
  // }, [image])

  return (
    <div className='preview-image w-full h-full relative'>
      <Image
        preview={{
          destroyOnClose: true,
          mask: <AiOutlineEye />,
          ...(image.thumbnail && {
            imageRender: () => (
              <video
                disablePictureInPicture
                // muted
                controls
                src={image.url}
                className='object-contain max-w-[80%] max-h-[80%] rounded-md'
              />
            ),
            toolbarRender: () => null
          })
        }}
        src={image.thumbnail ?? image.url}
        alt=''
        height={'100%'}
        width={'100%'}
        className={` block w-full h-full object-cover`}
      />
      {image.thumbnail && (
        <IoIosVideocam
          className='!absolute !top-1 !left-1 z-0 !text-gray-700 '
          size={20}
        />
      )}
    </div>
  )
}

const CreatePost = ({ open, setOpen, post, groupId }) => {
  const [hashtagOptions, setHashtagOptions] = useState([])
  const [draggable, setDraggable] = useState(true)
  const { user } = useSelector(state => state.auth)
  const { requests } = useSelector(state => state.friend)
  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])
  // const [form] = Form.useForm()
  const textareRef = useRef()
  const cammeraRef = useRef()
  const [tracks, setTracks] = useState(null)
  const dispatch = useDispatch()
  const [openCamera, setOpenCamera] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [images, setImages] = useState([])
  const [privacy, setPrivacy] = useState(groupId ? 'public' : 'private')
  const [location, setLocation] = useState(null)
  const [sentisment, setSentisment] = useState(null)
  const [tags, setTags] = useState([])
  const [type, setType] = useState('post')
  const [hashtags, setHashtags] = useState([])

  const [render, setRender] = useState(false)

  const endStream = () => {
    setOpenCamera(false)
    tracks?.forEach(track => track.stop())
  }

  const handeSelectPhoto = e => {
    try {
      let files = []
      if (e.target?.files?.length > 0) {
        console.log(e.target.files)
        for (const file of Array.from(e.target.files)) {
          if (Math.round(file?.size / 1024) >= 1024 * 20) {
            alert('File too Big, please select a file less than 20mb')
          } else {
            files.push(file)
          }
        }
      }

      const max = 20 - images.length
      if (e.target.files?.length > max) {
        toast.error('Too many photos and videos')
      }

      files?.slice(0, max).forEach(file => {
        if (file.type.match('image.*')) {
          const newFile = {
            name: file.name,
            url: URL.createObjectURL(file),
            input: true,
            file
          }
          setImages(pre => [...pre, newFile])
        } else if (file.type.match('video.*')) {
          const prefix = (Math.random() * 1e6).toString().slice(1, 5)
          generateVideoThumbnails(file, 2)
            .then(arr => {
              const newFile = {
                name: file.name,

                url: URL.createObjectURL(file),
                thumbnail: arr[1],
                input: true,
                file: new File([file], prefix + file.name, {
                  type: file.type
                }),
                thumbnailFile: dataURLtoFile(arr[1], prefix + '.jpeg')
              }

              setImages(pre => [...pre, newFile])
            })
            .catch(err => {
              const newFile = {
                name: file.name,
                url: URL.createObjectURL(file),
                file: file,
                thumbnail: defaultVideoThumbnail,
                thumbnailFile: dataURLtoFile(
                  'data:image/jpeg;base64,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',
                  prefix + '.jpeg'
                )
              }
              setImages(pre => [...pre, newFile])
            })
        }
      })
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong')
    }
  }
  const handleOpenFrontCamera = e => {
    setOpenCamera(true)
    setTimeout(() => {
      cammeraRef?.current?.scrollIntoView({
        behavior: 'smooth'
      })
    }, 2000)
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'user', audio: true } })
      .then(mediaStream =>
        // console.log({mediaStream, a: mediaStream.getVideoTracks()})
        {
          videoRef.current.srcObject = mediaStream
          videoRef.current.play()
          videoRef.current.setAttribute('width', 300)
          videoRef.current.setAttribute(
            'height',
            300 / mediaStream.getVideoTracks()[0].getSettings().aspectRatio
          )
          canvasRef.current.setAttribute('width', 300)
          canvasRef.current.setAttribute(
            'height',
            300 / mediaStream.getVideoTracks()[0].getSettings().aspectRatio
          )
          setTracks(mediaStream.getTracks())
        }
      )
      .catch(err => {
        toast.error(err)
      })
  }

  const captureImage = () => {
    try {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      context.fillStyle = '#AAA'
      context.drawImage(
        videoRef.current,
        0,
        0,
        videoRef.current.width,
        videoRef.current.height
      )

      const data = canvas.toDataURL('image/png')

      if (images.length >= 20) {
        toast.error('Select too many photos and videos')
      } else {
        setImages(pre => [
          ...pre,
          {
            name: 'my_image.png',
            url: data,
            file: dataURLtoFile(data, 'my_image.png')
          }
        ])
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleOk = () => {
    endStream()

    if (!post) {
      dispatch(
        createPostAction({
          content: textareRef.current?.value ?? '',
          photos: images,
          privacy,
          sentisment,
          location,
          tags: tags.map(tag => tag.value),
          groupId,
          hashtags
        })
      )
    } else {
      dispatch(
        updatePostAction({
          postId: post.id,
          content: textareRef.current?.value ?? '',
          photos: images,
          privacy,
          sentisment,
          location,
          hashtags,
          tags: tags.map(tag => tag.value)
        })
      )
    }

    setOpen(false)
  }

  useEffect(() => {
    getApi('/posts/hashtags')
      .then(({ data: { hashtags: arr } }) => {
        setHashtagOptions(
          arr.map(item => ({
            value: item.name,
            label: item.name,
            count: item._count.posts
          }))
        )
      })
      .catch(err => {})
  }, [])

  useEffect(() => {
    textareRef.current?.focus()
  }, [])
  useEffect(() => {
    if (post) {
      if (textareRef?.current) textareRef.current.value = post?.text ?? ''
      setRender(pre => !pre)
      setLocation(post?.location)
      setImages(post?.files ?? [])
      setSentisment(post?.feel)
      setPrivacy(post?.privacy)
      setHashtags(post?.hashtags?.map(item => item.name) ?? [])
      setTags(
        post?.tags?.map(user => ({
          value: user.id,
          label: user.firstname + ' ' + user.lastname
        }))
      )
    }
  }, [post])

  return (
    <Modal
      destroyOnClose
      // onOk={handleOk}
      maskClosable={false}
      open={open}
      title={
        type === 'location' ? (
          <div className='flex items-center gap-4 border-b border-gray-300 pb-3'>
            <div
              className='w-[30px] h-[30px] rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer'
              onClick={() => setType('post')}
            >
              <GrLinkPrevious />
            </div>
            Search for location
          </div>
        ) : type === 'sentisment' ? (
          <div className='flex items-center gap-4 border-b border-gray-300 pb-3'>
            <div
              className='w-[30px] h-[30px] rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer'
              onClick={() => setType('post')}
            >
              <GrLinkPrevious />
            </div>
            How are you feelings
          </div>
        ) : type === 'tag' ? (
          <div className='flex items-center gap-4 border-b border-gray-300 pb-3'>
            <div
              className='w-[30px] h-[30px] rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center cursor-pointer'
              onClick={() => setType('post')}
            >
              <GrLinkPrevious />
            </div>
            Tag people
          </div>
        ) : (
          <div className='pb-2 border-b border-gray-400'>
            {post ? 'Edit post' : 'Create a new post'}
          </div>
        )
      }
      okText='Create'
      cancelText='Cancel'
      onCancel={() => {
        endStream()
        setOpen(false)
      }}
      footer={
        type === 'post' && [
          <Button
            disabled={
              !(textareRef.current?.value?.trim()?.length > 0) &&
              !location &&
              !sentisment &&
              images?.length === 0
            }
            type='primary'
            key='back'
            className='w-full '
            onClick={handleOk}
          >
            {post ? 'Update' : 'Post'}
          </Button>
        ]
      }
    >
      <div>
        {/* maintain value text ref */}
        <form
          className={`create-post flex flex-col justify-between min-h-[40vh] max-h-[70vh] overflow-y-auto scroll-min ${
            type === 'post' ? 'block' : 'hidden'
          }`}
        >
          <div>
            <div className='flex items-center gap-2'>
              <Avatar size={'large'} src={user?.avatar?.url ?? defaulAvatar} />
              <div className='flex flex-col justify-center w-[calc(100%-40px)]'>
                <h1 className='font-[600]'>
                  {user?.lastname + ' ' + user?.firstname}{' '}
                  {sentisment &&
                    sentisment.icon + ' feeling ' + sentisment.name}{' '}
                  {tags?.length > 0 &&
                    'with ' +
                      tags
                        .map(({ label }, index, arr) => {
                          // const friend = friends.find(i => i?.id === friendId)
                          if (index === 0) return label
                          else if (index === arr.length - 1)
                            return ' and ' + label
                          else return ', ' + label
                        })
                        ?.join('') +
                      ' '}
                  {location && 'at ' + location.name}
                </h1>
                {!post?.groupId && (
                  <Tooltip
                    title='Who can see your post?'
                    className={`${groupId && '!hidden'}`}
                  >
                    <Select
                      suffixIcon={
                        <TiArrowSortedDown className='!translate-y-[1px]' />
                      }
                      className='!w-[100px] h-[25px] !text-[10px] !bg-gray-300 !rounded-md'
                      defaultValue='private'
                      bordered={false}
                      options={options}
                      value={privacy}
                      onChange={value => {
                        setPrivacy(value)
                      }}
                      size='small'
                    />
                  </Tooltip>
                )}
              </div>
            </div>
            <hr className='h-1' />
            <Select
              value={hashtags}
              onSelect={value => {
                if (hashtags.length > 5)
                  return toast.error('You can only add up to 5 hashtags')
                const regexExp = /^#[^ !@#$%^&*(),.?":{}|<>]*$/gi
                if (regexExp.test(value))
                  setHashtags(pre => [
                    ...pre.filter(item => item !== value),
                    value
                  ])
              }}
              onDeselect={value => {
                setHashtags(pre => pre.filter(item => item !== value))
              }}
              onChange={value => {
                console.log(value)
              }}
              // size='small'
              maxCount={5}
              suffixIcon={<></>}
              className='placeholder:!text-blue-500 placeholder:!italic'
              mode='tags'
              style={{
                width: '100%'
              }}
              placeholder='# hashtag'
              variant='borderless'
              // onChange={handleChange}
              tokenSeparators={[' ']}
              options={hashtagOptions}
              // tagRender={({ label }) => {
              //   return <span>{label}</span>
              // }}
              optionRender={(option, info) => {
                const regexExp = /^#[^ !@#$%^&*(),.?":{}|<>]*$/gi
                if (regexExp.test(option.data.label))
                  return (
                    <div>
                      <p className='italic text-blue-500'>{option.label}</p>
                      {option.data.count && option.data.count !== '0' ? (
                        <p className='text-sm text-gray-500'>
                          {option.data.count} posts
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  )
                else return <div className='text-red-500'>wrong format !</div>
              }}
            />

            {/* <Radio.Group
                options={options}
                onChange={({ target: { value } }) => {
                  setAccess(value)
                }}
                value={access}
              /> */}
            <hr className='h-1' />

            <div className='flex justify-between'>
              <textarea
                onChange={() => {
                  setRender(pre => !pre)
                }}
                ref={textareRef}
                name=''
                id=''
                // cols='49'
                rows='2'
                // className='pt-2 outline-none appearance-none resize-none'
                placeholder={`What's on your mind, ${user?.firstname}?`}
                className='p-2  outline-none appearance-none resize-none border text-lg w-[80%] border-gray-200 hover:border-blue-500 border-none hover:outline-none sroll-min'
                maxLength={200}
              ></textarea>
              <span className='pt-2'>
                <EmojiSelect textRef={textareRef} />
              </span>
            </div>
            <div className='flex justify-end'></div>
            {location && (
              <div className='h-[170px] rounded-md overflow-hidden relative'>
                <GoogleMapReact
                  options={{
                    fullscreenControl: false
                    // styles: [
                    //   {
                    //     stylers: [
                    //       { saturation: -100 },
                    //       { gamma: 100 },
                    //       { lightness: 10 },
                    //       { visibility: '0' }
                    //     ]
                    //   }
                    // ]
                  }}
                  bootstrapURLKeys={{
                    key: 'AIzaSyBZ1nIrsxL6R_NX1ATzKO8iLsWlU9C2aSA'
                  }}
                  defaultCenter={location}
                  defaultZoom={
                    location.type === 'Country'
                      ? 2
                      : location.type === 'Street'
                      ? 15
                      : location.type === 'Point Address' ||
                        location.type === 'POI'
                      ? 18
                      : 7
                  }
                  // zoom={defaultZoom}
                  yesIWantToUseGoogleMapApiInternals
                  onClick={({ x, y, lat, lng, event }) => {
                    console.log(x, y, lat, lng, event)
                    // setLocation({ lat, lng })
                  }}
                  draggable={draggable}
                  // draggable={true}
                  onChildMouseMove={(hoverKey, childProps, mouse) => {
                    setLocation({
                      ...location,
                      lat: mouse.lat,
                      lng: mouse.lng
                    })
                  }}
                  // onChildMouseDown={}
                  // onChildClick={(a, b, c) => {
                  //   console.log({ a, b, c })
                  // }}

                  onChildMouseDown={() => {
                    setDraggable(false)
                  }}
                  onChildMouseUp={() => {
                    setDraggable(true)
                  }}
                >
                  <AnyReactComponent
                    lat={location.lat}
                    lng={location.lng}
                    text='My Marker'
                  />
                </GoogleMapReact>
                <div className='w-[28px] h-[28px] absolute top-1 right-1 cursor-pointer rounded-full flex items-center justify-center bg-gray-50 border border-gray-100'>
                  <IoMdClose
                    size={20}
                    className='!text-gray-500'
                    onClick={() => {
                      setLocation(null)
                    }}
                  />
                </div>
              </div>
            )}

            {images && (
              <div className='flex pt-2 flex-wrap gap-1'>
                {images.map((image, i) => {
                  return (
                    <div
                      key={i}
                      className={`md:h-[100px] md:w-[130px] w-[80px] h-[60px]  border border-blue-300 p-1 relative ${
                        images?.length > 6 &&
                        'md:h-[60px] md:w-[80px] w-[60px] h-[45px] '
                      }`}
                    >
                      {<ImgShow image={image} key={i + 'j'} />}
                      <IoMdClose
                        fontSize='medium'
                        className='absolute top-0 right-0 text-red-400 cursor-pointer z-10'
                        onClick={() => {
                          const copy = [...images]
                          copy.splice(i, 1)
                          setImages(copy)
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div>
            {' '}
            {openCamera && (
              <>
                <div className='relative h-min flex justify-center py-2 my-2 border border-blue-400 mb-2'>
                  <video
                    // className={`${theme ? 'invert' : 'invert-0'}`}
                    onCanPlay={e => {
                      // console.log(e.target);
                    }}
                    ref={videoRef}
                    src=''
                  ></video>
                  <IoMdClose
                    fontSize='large'
                    className='absolute top-2 right-2  text-red-400 cursor-pointer'
                    onClick={() => {
                      // setOpenCamera(false);
                      // console.log(videoRef.current.srcObject);
                      // videoRef?.current?.srcObject
                      // 	?.getTracks()
                      // 	?.forEach((track) => track.stop());
                      endStream()
                    }}
                  />
                  {/* <ChangeCircleIcon
                fontSize='large'
                className='absolute bottom-3 right-3 text-red-400 cursor-pointer'
                onClick={handleOpenBackCamera}
              /> */}
                  <canvas className=' hidden ' ref={canvasRef}></canvas>
                </div>
              </>
            )}
            {openCamera ? (
              <div className='flex justify-center gap-3 ' ref={cammeraRef}>
                <FaCamera
                  sx={{ fontSize: '32px' }}
                  className='cursor-pointer'
                  onClick={captureImage}
                />
              </div>
            ) : (
              <div className='flex justify-center mt-1 gap-3'>
                <Tooltip color='#bfc2c6' title='Take photo with camera'>
                  <FaCamera
                    size={18}
                    className='cursor-pointer !text-gray-500'
                    onClick={handleOpenFrontCamera}
                  />
                </Tooltip>
                <label htmlFor='select-photo_create_post'>
                  <Tooltip color='#bfc2c6' title='Photo/video from library'>
                    <MdAddPhotoAlternate
                      size={22}
                      className='cursor-pointer  text-green-600 -translate-y-[2px]'
                    />
                  </Tooltip>
                </label>
                <input
                  className='hidden'
                  type='file'
                  id='select-photo_create_post'
                  multiple
                  onChange={handeSelectPhoto}
                  accept='image/*, video/*'
                />
                <Tooltip color='#bfc2c6' title='Check in'>
                  <IoLocationSharp
                    className='text-red-400 cursor-pointer'
                    size={21}
                    onClick={() => setType('location')}
                  />
                </Tooltip>
                {!groupId && !post?.groupId && (
                  <Tooltip color='#bfc2c6' title='Tag people'>
                    <FaUserTag
                      size={18}
                      className='text-blue-400 cursor-pointer'
                      onClick={() => {
                        setType('tag')
                      }}
                    />
                  </Tooltip>
                )}
                <Tooltip color='#bfc2c6' title='Feeling'>
                  <BsEmojiSmile
                    size={18}
                    className='text-yellow-300 cursor-pointer'
                    onClick={() => {
                      setType('sentisment')
                    }}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        </form>
        {type === 'post' ? (
          <></>
        ) : type === 'location' ? (
          <SearchLocation
            onCancel={() => setType('post')}
            setLocation={setLocation}
          />
        ) : type === 'sentisment' ? (
          <SentismentSelector
            sentisment={sentisment}
            setSentisment={setSentisment}
            setType={setType}
          />
        ) : (
          <TagFriend
            setType={setType}
            friends={
              post
                ? [
                    ...friends.filter(friend =>
                      post?.tags?.every(item => item.id !== friend.id)
                    ),
                    ...post.tags
                  ]
                : friends
            }
            selected={tags}
            setSelected={setTags}
          />
        )}
      </div>
    </Modal>
  )
}
const AnyReactComponent = ({ text }) => (
  // <Tooltip title={'ldldlddddddddd'}>
  <div
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -100%)'
    }}
  >
    <FaLocationDot size={38} color='red' className='' />
  </div> // </Tooltip>
)

const SearchLocation = ({ setLocation, onCancel }) => {
  const [term, setTerm] = useState('')
  const [list, setList] = useState([])

  console.log(list)

  useEffect(() => {
    function success (pos) {
      const crd = pos.coords

      // console.log('Your current position is:')
      // console.log(`Latitude : ${crd.latitude}`)
      // console.log(`Longitude: ${crd.longitude}`)
      // console.log(`More or less ${crd.accuracy} meters.`)
      console.log(3)
      axios
        .get(
          `https://api.tomtom.com/search/2/nearbySearch/.json?key=${tomtomApiKey}&lat=${crd.latitude}&lon=${crd.longitude}`
        )
        .then(res => {
          if (res.data?.summary?.numResults > 0) {
            setList(res.data?.results)
          }
        })
        .catch(err => {})

      // setTimeout(() => {
      //   setInterval(() => {
      //     setDefaultZoom(pre => Math.min(pre + 1, 18))
      //   }, 40)
      // }, 1000)
    }
    function error (err) {
      console.warn(`ERROR(${err.code}): ${err.message}`)
    }

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 50000,
      maximumAge: 0
    })
  }, [])

  useEffect(() => {
    if (term?.trim().length > 0) {
      axios
        .get(
          `https://api.tomtom.com/search/2/search/${term.trim()}.json?key=${tomtomApiKey}&language=vi-VN&limit=100`
        )
        .then(res => {
          console.log(res.data)
          setList(res.data.results)
        })
        .catch(err => {})
    }
  }, [term])

  return (
    <div className=''>
      <input
        value={term}
        onChange={e => setTerm(e.target.value)}
        type='text'
        className='block w-full px-4 py-2 rounded-[20px] border-none focus:outline-none bg-gray-200 mb-1'
        placeholder='🔍 Where are you'
      />

      <div className='min-h-[30vh] max-h-[60vh]  overflow-y-scroll scroll-min'>
        {list.map(item => (
          <LocationCard
            data={item}
            setLocation={setLocation}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  )
}

const LocationCard = ({ data, setLocation, onCancel }) => {
  return (
    <div
      className='w-full px-2 py-1 flex items-center gap-2 my-[1px] rounded-md hover:bg-gray-200 cursor-pointer'
      onClick={() => {
        setLocation({
          lat: data.position.lat,
          lng: data.position.lon,
          type: data.entityType ?? data.type,
          name: getNameAdressLocation(data).name,
          address: getNameAdressLocation(data).address
        })
        onCancel()
      }}
    >
      <div className='w-[32px] h-[32px] rounded-md bg-gray-500 flex justify-center items-center'>
        <IoLocationSharp size={22} className='text-gray-100' />
      </div>
      <div className='flex flex-col justify-center'>
        <h1 className='text-sm'>{getNameAdressLocation(data).name}</h1>
        <p className=' lead text-gray-500 text-[13px]'>
          {getNameAdressLocation(data).address}
        </p>
      </div>
    </div>
  )
}

const sentisments = [
  { name: 'positive', icon: '😊' },
  { name: 'negative', icon: '😞' },
  { name: 'neutral', icon: '😐' },
  { name: 'happy', icon: '😃' },
  { name: 'sad', icon: '😢' },
  { name: 'angry', icon: '😠' },
  { name: 'surprised', icon: '😲' },
  { name: 'confused', icon: '😕' },
  { name: 'laughing', icon: '😂' },
  { name: 'heart eyes', icon: '😍' },
  { name: 'thumbs up', icon: '👍' },
  { name: 'thumbs down', icon: '👎' },
  { name: 'fire', icon: '🔥' },
  { name: 'clap', icon: '👏' },
  { name: 'thinking', icon: '🤔' },
  { name: 'cool', icon: '😎' },
  { name: 'love', icon: '❤️' },
  { name: 'shocked', icon: '😱' },
  { name: 'sleepy', icon: '😴' },
  { name: 'money', icon: '💰' },
  { name: 'celebration', icon: '🎉' },
  { name: 'sick', icon: '🤢' },
  { name: 'innocent', icon: '😇' },
  { name: 'sunglasses', icon: '😎' },
  { name: 'alien', icon: '👽' },
  { name: 'robot', icon: '🤖' },
  { name: 'unicorn', icon: '🦄' }
]

const SentismentSelector = ({ sentisment, setSentisment, setType }) => {
  const [term, setTerm] = useState('')
  const [filters, setFilters] = useState(sentisments)

  useEffect(() => {
    try {
      if (term?.trim().length > 0) {
        let tokens = term.split(' ').filter(item => item)
        setFilters(
          sentisments.filter(item => {
            return tokens.every(token => item.name.includes(token))
          })
        )
      } else setFilters(sentisments)
    } catch (error) {
      setFilters([])
    }
  }, [term])
  console.log(filters)
  return (
    <div className='w-full '>
      <Input
        value={term}
        onChange={e => setTerm(e.target.value)}
        className='!rounded-[20px] mt-3 '
        placeholder='🔍 Search'
      />
      <div className='grid grid-cols-2 gap-1 min-h-[100px] max-h-[400px] overflow-y-scroll scroll-min mt-2'>
        {filters?.map(item => (
          <div
            className={`flex items-center gap-3 w-full h-[52px] rounded-md group hover:bg-gray-100 my-[1px] cursor-pointer px-2 ${
              item.name === sentisment?.name && 'bg-gray-100 '
            }`}
            onClick={() => {
              if (item.name === sentisment?.name) {
                setSentisment(null)
              } else {
                setSentisment(item)
                setType('post')
              }
            }}
          >
            <div className=' h-9 w-9 rounded-full bg-[#e4e6eb] flex items-center justify-center'>
              <span className='text-[18px] group-hover:scale-[1.4]'>
                {item?.icon}
              </span>
            </div>

            <span>{item?.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TagFriend = ({ setType, selected, setSelected, friends }) => {
  const options = friends?.map(friend => ({
    label: friend.firstname + ' ' + friend.lastname,
    value: friend.id
  }))
  return (
    <div className='min-h-[300px] mt-3 flex gap-2'>
      <div className='w-[80%]'>
        <MultiSelect
          key={'2ksk'}
          ItemRenderer={({ checked, option, onClick, disabled }) => (
            <div
              className={`item-renderer ${
                disabled ? 'disabled' : ''
              } !flex !items-center`}
            >
              <input
                type='checkbox'
                onChange={onClick}
                checked={checked}
                tabIndex={-1}
                disabled={disabled}
              />
              {option.value ? (
                <div className='flex gap-1 items-center'>
                  <Avatar
                    src={
                      friends.find(item => item.id === option.value)?.avatar
                        ?.url ?? defaulAvatar
                    }
                  />
                  <p>{option.label}</p>
                </div>
              ) : (
                <span>{'Slect all friends'}</span>
              )}
            </div>
          )}
          valueRenderer={(selected, _options) => {
            return selected.length
              ? selected.map(({ label }, i) =>
                  i === selected.length - 1 ? ' ' + label : ' ' + label + ','
                )
              : ''
          }}
          className=''
          placeholder='Search for friends'
          options={options}
          value={selected}
          onChange={setSelected}
          labelledBy='Select'
        />
      </div>
      <Button
        type='link'
        onClick={() => {
          setType('post')
        }}
      >
        Done
      </Button>
    </div>
  )
}

function getNameAdressLocation (location = {}) {
  switch (location.type) {
    case 'POI':
      return {
        name: location?.poi?.name,
        address: ignoreCode(location?.address?.freeformAddress)
      }
    case 'Street':
      return {
        name: location.address?.streetName,
        address: ignoreCode(location?.address?.freeformAddress)
      }

    case 'Point Address':
      return {
        name:
          location.address?.streetNumber + ' ' + location.address?.streetName,
        address: ignoreCode(location?.address?.freeformAddress)
      }

    case 'Geography':
      // switch (location.entityType) {
      //   case 'Country':
      //     return {
      //       name: location.address?.country,
      //       address: ignoreCode(location?.address?.freeformAddress)
      //     }

      //   case 'CountrySubdivision':
      //     return {
      //       name: location.address?.countrySubdivision,
      //       address: ignoreCode(location?.address?.freeformAddress)
      //     }
      //   default:
      //     return { name: '', location: '' }
      // }
      return getGeography(location.address)

    default:
      return { name: '', location: '' }
  }
}

function ignoreCode (address = '') {
  const tokens = address.split(',')
  tokens.pop()
  return tokens.join('')
}

function getGeography (address) {
  let tokens =
    [
      address.municipalitySubdivision,
      address.municipality,
      address.countrySecondarySubdivision,
      address.countrySubdivision,
      address.country
    ].filter((item, index, arr) => {
      if (index > 0) return item !== arr[index - 1]
      else return item !== undefined
    }) ?? []
  return { name: tokens[0], address: tokens.join(', ') }
}

export default CreatePost
