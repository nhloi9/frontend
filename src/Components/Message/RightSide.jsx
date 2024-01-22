import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BsMessenger, BsPlusCircle } from 'react-icons/bs'
// import TextareaAutosize from 'react-textarea-autosize'
// import EmojiSelect from '../EmojiSelect'
import { useDispatch, useSelector } from 'react-redux'
import { BiSend } from 'react-icons/bi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IoCall } from 'react-icons/io5'
import { FcVideoCall } from 'react-icons/fc'
import InputEmoji from 'react-input-emoji'
import ReactLoading from 'react-loading'
import { FaCircleInfo } from 'react-icons/fa6'
import Avatar from '../Home/Avatar'
import { FiCamera } from 'react-icons/fi'

import { format, startOfWeek } from 'date-fns'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteApi, getApi, postApi, putApi } from '../../network/api'
import { Avatar as AntAvatar, Button, Modal, Popconfirm, Tooltip } from 'antd'
import {
  defaulAvatar,
  defaultCoverImage,
  defaultImageConversation
} from '../../Constants'
import { upload } from '../../utils/imageUpload'
import {
  getImageOfConversation,
  getNameOfConversation
} from '../../utils/conversation'
import {
  addMessage,
  seenConversation
} from '../../Reduxs/Actions/conversationAction '
import { socket } from '../../socket'
import toast from 'react-hot-toast'
import { IoMdClose } from 'react-icons/io'
import { callTypes } from '../../Reduxs/Types/callType'
import dayjs from 'dayjs'
import { globalTypes } from '../../Reduxs/Types/globalType'
import { conversationTypes } from '../../Reduxs/Types/conversationType'
import { CiEdit } from 'react-icons/ci'
import { MdLogout, MdOutlineDeleteForever } from 'react-icons/md'
import { MultiSelect } from 'react-multi-select-component'
import Peer from 'peerjs'

const RightSide = ({ id }) => {
  const [showInfo, setShowInfo] = useState(false)
  const [openInvite, setOpenInvite] = useState(false)
  const [cusor, setCusor] = useState(null)
  const [messages, setMessages] = useState([])
  const [conversation, setConversation] = useState(null)
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)
  const [inputMessage, setInputMessage] = useState('')
  const [images, setImages] = useState([])
  const listRef = useRef(null)
  const { requests } = useSelector(state => state.friend)

  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])

  //to force rerender
  const [key, setKey] = useState(0)

  const handleLoadMore = () => {
    if (cusor !== undefined) {
      getApi('/messages', {
        conversationId: id,
        cusor
      })
        .then(({ data: { messages: messagesData, cusor: newCusor } }) => {
          setMessages(pre => [...pre, ...messagesData])
          setCusor(newCusor)
        })
        .catch(err => {})
    }
  }

  const handeSelectPhoto = e => {
    try {
      const max = 20 - images.length
      if (e.target.files?.length > max) {
        toast.error('Too many photos and videos')
      }
      Array.from(e.target.files)
        ?.slice(0, max)
        .forEach(file => {
          if (file.type.match('image.*')) {
            const newFile = {
              name: file.name,
              url: URL.createObjectURL(file),

              file
            }
            setImages(pre => [...pre, newFile])
          }
        })
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleCreateMessage = async e => {
    e.preventDefault()
    try {
      let uploadedImages = []
      if (images?.length > 0) {
        uploadedImages = await upload(images.map(image => image.file))
      }
      const {
        data: { message }
      } = await postApi('/messages', {
        conversationId: id,
        text: inputMessage,
        files: uploadedImages
      })
      socket.emit('addMessage', {
        message
      })
      setMessages([message, ...messages])
      const cloneConversation = structuredClone(conversation)
      cloneConversation.members.forEach(member => {
        if (member.userId === user.id) {
          member.isSeen = true
        } else {
          member.isSeen = false
        }
      })
      setConversation(cloneConversation)
      dispatch(addMessage(message))
      setInputMessage('')
    } catch (error) {}
  }

  //seen messages
  useEffect(() => {
    const onMessage = ({ message }) => {
      try {
        if (message.member.conversationId?.toString() === id) {
          setMessages(messages => [message, ...messages])
          const cloneConversation = structuredClone(conversation)
          cloneConversation.lastMessage = message

          cloneConversation.members?.forEach(item => {
            if (
              item?.userId === message.member?.userId ||
              item?.userId === user.id
            ) {
              item.isSeen = true
            } else item.isSeen = false
          })
          socket.emit('seenConversation', { conversationId: id })
          dispatch(seenConversation(id, user.id, true))
        }
      } catch (error) {}
    }

    if (conversation) socket.on('addMessage', onMessage)
    return () => socket.off('addMessage', onMessage)
  }, [dispatch, id, conversation, user.id])

  useEffect(() => {
    const onSeenConversation = ({ conversationId, userId }) => {
      try {
        if (conversationId.toString() === id) {
          const cloneConversation = structuredClone(conversation)
          console.log('dkdk')
          cloneConversation.members?.forEach(item => {
            if (item?.userId === userId) {
              item.isSeen = true
            }
          })
          setConversation(cloneConversation)
        }
      } catch (error) {}
    }
    if (conversation) socket.on('seenConversation', onSeenConversation)
    return () => socket.off('seenConversation', onSeenConversation)
  }, [conversation, id])

  const handleCall = ({ video }) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video })
      .then(stream => {
        stream.getTracks().forEach(x => x.stop())

        dispatch({
          type: callTypes.CALL,
          payload: { type: 'video', conversation, author: true }
        })

        socket.emit('call', {
          type: 'video',
          conversation: conversation
        })
      })
      .catch(err => {
        toast.error(
          "You need to give the app permission to access the device's audio or camera"
        )
      })
  }

  const handleInvite = async ids => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: true }
      })
      await postApi('/conversations/members', {
        userIds: ids,
        conversationId: conversation?.id
      })
      const {
        data: { conversation: con }
      } = await getApi('/conversations/' + conversation?.id)
      setConversation(con)

      dispatch({
        type: conversationTypes.ADD_OR_UPDATE_CONVERSATION,
        payload: con
      })

      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: false }
      })
      setOpenInvite(false)
      setShowInfo(true)
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: { error: 'Something wrong' }
      })
    }
  }

  useEffect(() => {
    if (id) {
      setShowInfo(false)
      setConversation(null)
      setCusor(null)
      setMessages([])
      dispatch(seenConversation(id, user.id, true))
      getApi('/messages', {
        conversationId: id
      })
        .then(({ data: { messages, cusor: newCusor } }) => {
          setMessages(messages)
          setCusor(newCusor)
        })
        .catch(err => {})

      getApi('/conversations/' + id)
        .then(({ data: { conversation: con } }) => setConversation(con))
        .catch(err => {})
    }
  }, [id, dispatch, user.id])

  // useEffect(() => {
  //   const peer = new Peer(socket.socket.id, {
  //     // host: 'localhost',
  //     // host: backendHost,
  //     host: 'horizon-backend-baxc.onrender.com',
  //     port: 1000,
  //     path: '/',
  //     secure: true
  //   })
  //   console.log({ peer })

  //   return () => {
  //     peer?.destroy()
  //   }
  // }, [])

  return (
    <div className='h-screen w-[calc(100%-350px)] pt-[50px]   right-side-message'>
      {conversation ? (
        //using startofweek to check different weeks
        <>
          <div className=' flex flex-col w-full h-full p-3 pr-1 right-side '>
            <div className=' w-full flex justify-between items-center pb-2 my-2 border-b'>
              <div className='flex items-center h-[50px]'>
                {getImageOfConversation(conversation, user?.id).length === 0 ? (
                  <Avatar size={40} src={defaultImageConversation} />
                ) : getImageOfConversation(conversation, user?.id).length ===
                  1 ? (
                  <Avatar
                    size={40}
                    src={
                      getImageOfConversation(conversation, user?.id)[0] ??
                      defaulAvatar
                    }
                  />
                ) : (
                  <div className='w-[40px] h-[40px] relative'>
                    <img
                      alt=''
                      className='w-[27px] h-[27px] border-white block  rounded-full !absolute bottom-0 left-0 !z-20 !shadow-lg border'
                      src={
                        getImageOfConversation(conversation, user?.id)[0] ??
                        defaulAvatar
                      }
                    ></img>
                    <AntAvatar
                      size={26}
                      className='!absolute top-0 right-0'
                      src={
                        getImageOfConversation(conversation, user?.id)[1] ??
                        defaulAvatar
                      }
                    />
                  </div>
                )}
                <div className='mx-1 flex flex-col justify-center gap-[-3px]'>
                  <h1 className='font-[500]'>
                    {/* {conversation?.isGroup ? conversation?.name : conv} */}
                  </h1>
                  <p className='text-gray-700 font-[600]'>
                    {conversation &&
                      getNameOfConversation(conversation, user.id)}{' '}
                  </p>
                </div>
              </div>
              <div className='flex gap-3 px-2'>
                <FcVideoCall
                  size={23}
                  onClick={() => handleCall({ video: true })}
                  className=' cursor-pointer !text-[#ff0d9e] '
                />
                <Tooltip placement='leftTop' title='Conversation information'>
                  <FaCircleInfo
                    onClick={() => setShowInfo(true)}
                    size={20}
                    color='blue'
                    className='cursor-pointer'
                  />
                </Tooltip>
              </div>
              {/* <div className='flex gap-3 pr-3'>
              <IoCall
                color='green'
                size={23}
                className='cursor-pointer'
                onClick={() => {
                  handleCall({ video: false })
                }}
              />
              <FcVideoCall
                color='green'
                size={23}
                onClick={() => handleCall({ video: true })}
                className=' cursor-pointer'
              />
            </div> */}
            </div>

            {/* display list messages */}
            <div
              className='w-full py-2  h-full  overflow-y-auto   '
              id='scrollableDiv'
              style={{ display: 'flex', flexDirection: 'column-reverse' }}
            >
              <div ref={listRef} className='pt-1'></div>
              <div className='flex justify-end'>
                <Tooltip
                  placement='bottomLeft'
                  title={
                    'seen by ' +
                    conversation.members
                      .filter(
                        member =>
                          member?.isSeen === true && member?.userId !== user.id
                      )
                      .map(item => item?.user?.firstname)
                      .join(', ')
                  }
                >
                  <div className='flex justify-end pr-3 gap-1'>
                    {/* {seen && (
                <Avatar url={active.other.avatar} size={'micro-avatar'} />
              )} */}
                    {conversation.members
                      .filter(
                        member =>
                          member?.isSeen === true && member?.userId !== user.id
                      )
                      ?.map(item => (
                        <Avatar
                          src={item?.user?.avatar?.url ?? defaulAvatar}
                          size={16}
                        />
                      ))}
                  </div>
                </Tooltip>
              </div>
              <InfiniteScroll
                scrollableTarget='scrollableDiv'
                hasMore={true}
                dataLength={messages.length ?? 0}
                loader={
                  cusor !== undefined && (
                    <div className='flex w-full  justify-center pointer-events-none  relative'>
                      <ReactLoading
                        type='spin'
                        color='#ccc'
                        height={'30px'}
                        width={'30px'}
                      />
                    </div>
                  )
                }
                style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
                inverse={true} //
                next={handleLoadMore}
              >
                {messages &&
                  messages.map((message, index) => (
                    <MessageCard
                      isGroup={conversation?.isGroup}
                      index={index}
                      key={message.id}
                      message={message}
                      user={user}
                      // other={active.other}
                    >
                      {index === messages.length - 1 ||
                      startOfWeek(new Date(message.createdAt), {
                        weekStartsOn: 1
                      }).getDate() !==
                        startOfWeek(new Date(messages[index + 1].createdAt), {
                          weekStartsOn: 1
                        }).getDate() ? (
                        <div className='w-full flex justify-center'>
                          <p className=' text-[13px] text-gray-500'>
                            {format(
                              new Date(message.createdAt),
                              'MMMM d, h:mm a'
                            )}
                          </p>
                        </div>
                      ) : new Date(message.createdAt).getDate() !==
                        new Date(messages[index + 1].createdAt).getDate() ? (
                        <div className='w-full flex justify-center'>
                          <p className=' text-[13px] text-gray-500'>
                            {format(new Date(message.createdAt), 'EEEE h:mm a')}
                          </p>
                        </div>
                      ) : (
                        // new Date(message.createdAt).getTime() -
                        //   new Date(messages[index - 1].createdAt).getTime() >
                        //   5 * 60 * 1000
                        Math.floor(
                          new Date(message.createdAt).getMinutes() / 15
                        ) !==
                          Math.floor(
                            new Date(
                              messages[index + 1].createdAt
                            ).getMinutes() / 15
                          ) && (
                          <div className='w-full flex justify-center'>
                            <p className=' text-[13px] text-gray-500'>
                              {format(new Date(message.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        )
                      )}
                    </MessageCard>
                  ))}
              </InfiniteScroll>
            </div>

            {images && images.length > 0 && (
              <div className=' px-[40px] w-[80%] max-h-[120px] overflow-y-scroll scroll-min flex min-h-[50px] flex-wrap gap-2'>
                {images.map((image, i) => {
                  return (
                    <div key={i} className={`w-12 h-12 relative`}>
                      {
                        <img
                          alt=''
                          src={image?.url}
                          className={` block w-full h-full object-cover border rounded-md`}
                        />
                      }
                      <div className='absolute -top-1 -right-1 border flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-sm cursor-pointer'>
                        <IoMdClose
                          fontSize='medium'
                          className=' text-red-400 cursor-pointer z-10'
                          onClick={() => {
                            const copy = [...images]
                            copy.splice(i, 1)
                            setImages(copy)
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {/* input message */}
            <form
              className=' w-full h-min flex  items-center gap-1 mt-1 relative '
              onSubmit={handleCreateMessage}
            >
              <label htmlFor='123'>
                <Tooltip color='#bfc2c6' title='Attach a file'>
                  <BsPlusCircle
                    color='blue'
                    size={20}
                    className='mb-2 cursor-pointer'
                  />
                </Tooltip>
              </label>
              <input
                className='hidden'
                type='file'
                id='123'
                multiple
                onChange={handeSelectPhoto}
                accept='image/*'
              />

              <InputEmoji
                placeholder=''
                maxLength={200}
                value={inputMessage}
                onChange={setInputMessage}
                onEnter={() => {
                  console.log(3)
                }}
              />

              <button
                type='submit'
                className={`absolute z-10 top-[50%] hover:scale-125 -translate-y-[45%] right-14 p-[1px]  !bg-transparent ${
                  inputMessage?.trim()?.length > 0 &&
                  'cursor-pointer !text-blue-600'
                } text-gray-500 cursor-default`}
              >
                <BiSend size={20} className={` `} />
              </button>
              {/* <div className='pb-2'> */}
              {/* <EmojiSelect textRef={textRef} css='bottom-6 right-1' /> */}
              {/* </div> */}
            </form>
          </div>
          {
            // showInfo &&
            !conversation?.isGroup ? (
              <ConversationInfo
                conversation={conversation}
                onCancel={() => {
                  setShowInfo(false)
                }}
                open={showInfo}
                user={user}
              />
            ) : (
              <GroupInfo
                setOpenInvite={setOpenInvite}
                setConversation={setConversation}
                conversation={conversation}
                onCancel={() => {
                  setShowInfo(false)
                }}
                open={showInfo}
                user={user}
              />
            )
          }
          {openInvite && (
            <Invite
              isModalOpen={openInvite}
              friends={friends?.filter(
                item =>
                  !conversation?.members?.find(
                    member => member?.userId === item?.id
                  )
              )}
              handleInvite={handleInvite}
              handleCancel={() => {
                setOpenInvite(false)
                setShowInfo(true)
              }}
            />
          )}
        </>
      ) : (
        // <div></div>
        <div className=' flex  w-full h-full  justify-center items-center'>
          <BsMessenger size={35} color='blue' />
        </div>
      )}
    </div>
  )
}

export default RightSide

const ConversationInfo = ({ onCancel, open, conversation, user }) => {
  const navigate = useNavigate()
  const otherMembers = conversation.members.filter(
    item => item?.user?.id !== user.id
  )

  return (
    <Modal
      footer={[]}
      title='Profile'
      open={open}
      // open={true}
      onCancel={onCancel}
      maskClosable={false}
    >
      <img
        src={
          otherMembers[0]?.user?.detail?.coverImgae?.url ?? defaultCoverImage
        }
        alt=''
        className='block w-full h-[170px] object-cover'
      />
      <div className='flex'>
        <div className='w-min -translate-y-[20px] ml-[20px]'>
          <Avatar
            src={otherMembers[0]?.user?.avatar?.url ?? defaulAvatar}
            size={80}
            onClick={() => navigate('/profile/' + otherMembers[0]?.user?.id)}
          />
        </div>
        <span
          className='  pl-4 mt-3 font-[500] text-[17px] '
          // onClick={() => navigate('/profile/' + otherMembers[0]?.user?.id)}
        >
          {otherMembers[0]?.user?.firstname +
            ' ' +
            otherMembers[0]?.user?.lastname}
        </span>
      </div>
      <hr className='h-[1px] bg-gray-300' />
      <br />
      <p className='font-[500]'>Personal information</p>
      {otherMembers[0]?.user?.detail?.gender && (
        <div className='flex'>
          <div className='w-[110px]'>Gender</div>
          <span className='capitalize'>
            {otherMembers[0]?.user?.detail?.gender}
          </span>
        </div>
      )}
      <div className='flex'>
        <span className='w-[110px]'>Birthday</span>
        <span>
          {otherMembers[0]?.user?.detail?.birthday
            ? dayjs(otherMembers[0]?.user?.detail?.birthday).format(
                'DD-MM-YYYY'
              )
            : '••/••/••••'}
        </span>
      </div>

      <div className='flex'>
        <span className='w-[110px]'>Phone number</span>
        <span>
          {otherMembers[0]?.user?.detail?.phone ?? (
            <span className='pb-[3px] font-[600]'>••••••••••</span>
          )}
        </span>
      </div>
    </Modal>
  )
}
const GroupInfo = ({
  onCancel,
  open,
  conversation,
  user,
  setConversation,
  setOpenInvite
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const editRef = useRef(null)
  const [onEdit, setOnEdit] = useState(false)
  const otherMembers = conversation.members.filter(
    item => item?.user?.id !== user.id
  )
  const { conversations } = useSelector(state => state.conversations)

  const handleUpdateImage = async e => {
    try {
      const avatar = e.target.files[0]
      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: true }
      })
      const images = await upload([avatar])
      await putApi('/conversations/image', {
        conversationId: conversation.id,
        image: images[0]
      })
      setConversation(pre => ({ ...pre, image: images[0] }))

      const existConversation = conversations?.find(
        item => item.id === conversation.id
      )
      if (existConversation) {
        const newConversation = {
          ...existConversation,
          image: images[0]
        }
        dispatch({
          type: conversationTypes.ADD_OR_UPDATE_CONVERSATION,
          payload: newConversation
        })
      }

      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: false }
      })
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: { error }
      })
    }
  }
  const updateName = async () => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: true }
      })
      await putApi('/conversations/name', {
        conversationId: conversation.id,
        name: editRef.current?.value?.trim() ?? ''
      })

      setConversation(pre => ({
        ...pre,
        name: editRef.current?.value?.trim() ?? ''
      }))

      const existConversation = conversations?.find(
        item => item.id === conversation.id
      )
      if (existConversation) {
        const newConversation = {
          ...existConversation,
          name: editRef.current?.value?.trim() ?? ''
        }
        dispatch({
          type: conversationTypes.ADD_OR_UPDATE_CONVERSATION,
          payload: newConversation
        })
      }
      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: false }
      })
      setOnEdit(false)
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: { error }
      })
    }
  }

  const myMember = conversation?.members?.find(item => item.userId === user?.id)

  const delelteMember = async memberId => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: true }
      })

      await deleteApi('/conversations/members/' + memberId)

      if (memberId !== myMember.id) {
        setConversation(pre => ({
          ...pre,
          members: pre.members.filter(item => item?.id !== memberId)
        }))
        const existConversation = conversations?.find(
          item => item.id === conversation.id
        )
        if (existConversation) {
          const newConversation = {
            ...existConversation,
            members: existConversation?.members?.filter(
              item => item?.id !== memberId
            )
          }
          dispatch({
            type: conversationTypes.ADD_OR_UPDATE_CONVERSATION,
            payload: newConversation
          })
        }
      } else {
        dispatch({ type: conversationTypes.DELTE, payload: conversation.id })
        setConversation(null)
      }

      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: false }
      })
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: { error: 'Something wrong' }
      })
    }
  }

  return (
    <Modal
      footer={[]}
      title='Group Info'
      open={open}
      // open={true}
      onCancel={onCancel}
      maskClosable={false}
    >
      <div className='flex'>
        <div className='w-min relative '>
          <img
            alt=''
            referrerpolicy='no-referrer'
            // referrerPolicy={'no-referrer'}
            src={conversation?.image?.url || defaultImageConversation}
            className='w-[80px] h-20 rounded-full border'
            onClick={() => navigate('/profile/' + otherMembers[0]?.user?.id)}
          />
          <label htmlFor='change-avatar-conversation'>
            <div className=' border border-gray-50 bg-gray-200 cursor-pointer rounded-full absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center '>
              <FiCamera />
            </div>
          </label>

          <input
            onChange={handleUpdateImage}
            accept='image/png, image/gif, image/jpeg'
            type='file'
            id='change-avatar-conversation'
            className='hidden'
          />
        </div>
        {!onEdit ? (
          <div className='  pl-4 mt-5  flex gap-2'>
            <span
              onkeypress='return (this.innerText.length <= 25)'
              id='jdjdjd'
              className='  h-min   font-[500] text-[17px] '
              // onClick={() => navigate('/profile/' + otherMembers[0]?.user?.id)}
            >
              {conversation?.name || '••••••••'}
            </span>
            <span>
              <CiEdit
                onClick={() => {
                  setOnEdit(true)
                  setTimeout(() => {
                    if (editRef.current)
                      editRef.current.value = conversation?.name ?? ''
                    editRef.current?.focus()
                  }, 100)
                }}
                size={20}
                className=' cursor-pointer translate-y-[3px]'
              />
            </span>
          </div>
        ) : (
          <div className='  pl-4 mt-5  flex gap-2 h-min'>
            <input
              showCount
              maxLength={50}
              ref={editRef}
              name=''
              id=''
              className=' focus:outline-none w-[200px] border border-blue-400 rounded-sm text-[17px] p-2 resize-none bg-transparent'
            ></input>
            <div className='flex justify-end  text-[14px]  '>
              <Button type='link' onClick={() => setOnEdit(false)}>
                <span className='text-red-400'> cancel</span>
              </Button>
              <Button type='link' onClick={updateName}>
                update
              </Button>
            </div>
          </div>
        )}
      </div>
      <br />
      <hr className='h-[1px] bg-gray-300' />
      <br />
      <p className='font-[500]'>Member ({conversation?.members?.length})</p>
      <Button
        className='w-full !my-2'
        type='default'
        onClick={() => {
          setOpenInvite(true)
          onCancel()
        }}
      >
        + Add members
      </Button>
      {conversation.members?.map(member => (
        <div className='flex justify-between group items-center hover:bg-gray-200 p-1 rounded-sm'>
          <div className='flex items-center gap-2 my-2'>
            <Avatar
              size={30}
              src={member?.user?.avatar?.url || defaulAvatar}
              onClick={() => navigate('/profile/' + member?.user?.id)}
            />
            <div className='flex flex-col justify-center'>
              <p
                className='text-sm font-[500] cursor-pointer hover:underline'
                onClick={() => navigate('/profile/' + member?.user?.id)}
              >
                {member?.user?.firstname + ' ' + member?.user?.lastname}
              </p>
              {member?.isAdmin && (
                <p className='text-[13px] text-gray-600 '>Owner</p>
              )}
            </div>
          </div>
          {user?.id ===
            conversation?.members?.find(item => item?.isAdmin)?.user?.id &&
            user?.id !== member?.user?.id && (
              <Popconfirm
                title='Remove member'
                description={`Are you sure to remove ${
                  member?.user?.firstname
                } from ${conversation.name || 'conversation'}?`}
                onConfirm={() => {
                  delelteMember(member?.id)
                }}
                okText='Yes'
                cancelText='No'
              >
                <MdOutlineDeleteForever
                  size={20}
                  className='!text-gray-500 hidden group-hover:block cursor-pointer'
                />
              </Popconfirm>
            )}
        </div>
      ))}
      {!myMember?.isAdmin && (
        <div
          className='cursor-pointer hover:bg-gray-200 rounded-sm px-1 py-2 flex  items-center'
          onClick={() => delelteMember(myMember?.id)}
        >
          <div className='w-[36px] flex items-center justify-center'>
            <MdLogout className=' text-red-400' />
          </div>
          <span className='text-sm text-red-400'>Leave group</span>
        </div>
      )}
    </Modal>
  )
}

const Invite = ({ isModalOpen, handleCancel, friends, handleInvite }) => {
  const [selected, setSelected] = useState([])

  const options = friends?.map(friend => ({
    label: friend.firstname + ' ' + friend.lastname,
    value: friend.id
  }))
  return (
    <Modal
      title='Add friends to conversation'
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button
          key='submit'
          type='primary'
          // loading={loading}
          disabled={selected?.length === 0}
          onClick={() => {
            handleInvite(selected.map(item => item?.value))
            setSelected([])
          }}
        >
          Add
        </Button>
      ]}
    >
      <div className='min-h-[50vh]'>
        <br />
        <MultiSelect
          overrideStrings={{
            selectSomeItems: 'Search for friends by name'
          }}
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
                    size={30}
                    src={
                      friends.find(item => item.id === option.value)?.avatar
                        ?.url || defaulAvatar
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
          // placeholder='Invite friends( optional)'

          options={options}
          value={selected}
          onChange={setSelected}
          labelledBy='Select'
        />
      </div>
    </Modal>
  )
}

function MessageCard ({ message, user, children, isGroup }) {
  const [preview, setPreview] = useState(null)
  useEffect(() => {
    if (
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
        message?.text
      )
    ) {
      getApi('/files/link-preview', {
        link: message.text
      })
        .then(({ data: { preview: i } }) => setPreview(i))
        .catch(err => {
          console.log({ err })
        })
    }
  }, [message?.text])

  if (message?.member?.userId === user.id) {
    return (
      <div className='p-2  w-full'>
        {children}
        {preview ? (
          <div className='flex justify-end py-1 px-2 '>
            <LinkPreview data={preview} />
          </div>
        ) : (
          <>
            <div className='flex justify-end '>
              <div
                className={`${
                  message.id ? '' : 'opacity-50 '
                } max-w-[60%] bg-[#f0f0f0] rounded-[10px] py-1 px-2  min-w-[30px]  overflow-hidden`}
              >
                {/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
                  message?.text
                ) ? (
                  <a href={message.text} target='_blank' rel='noreferrer'>
                    {message.text}
                  </a>
                ) : (
                  message.text
                )}
              </div>
            </div>
          </>
        )}
        {message?.files?.length > 0 && (
          <div className='flex justify-end '>
            <div
              className={` max-w-[60%] flex justify-end flex-wrap  pt-1 px-2  min-w-[30px]  gap-2`}
            >
              {message?.files?.map(file => (
                <img
                  src={file?.url}
                  alt=''
                  className='w-20 h-20 rounded-md object-cover'
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  } else
    return (
      <div>
        {children}
        {isGroup && (
          <span className='block text-gray-400 -mb-1 ml-9 text-[13px]'>
            {message?.member?.user?.firstname}
          </span>
        )}
        <div className='flex justify-start my-2  w-full '>
          <Avatar
            src={message.member?.user?.avatar?.url ?? defaulAvatar}
            size='30'
          />
          {preview ? (
            <div className='flex py-1 px-2 '>
              <LinkPreview data={preview} />
            </div>
          ) : (
            <div className='w-[calc(100%-40px)]'>
              <div className='w-min max-w-[60%] !bg-gray-300 rounded-[10px]  py-1 px-2 mx-1 flex  min-w-[30px]  overflow-hidden '>
                {/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
                  message?.text
                ) ? (
                  <a href={message.text} target='_blank' rel='noreferrer'>
                    {message.text}
                  </a>
                ) : (
                  message.text
                )}
              </div>
              {message?.files?.length > 0 && (
                <div
                  className={` max-w-[60%] flex justify-start flex-wrap  pt-1 px-2  min-w-[30px]  gap-2`}
                >
                  {message?.files?.map(file => (
                    <img
                      src={file?.url}
                      alt=''
                      className='w-20 h-20 rounded-md object-cover'
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
}

const LinkPreview = ({ data }) => {
  const navigate = useNavigate()
  return (
    <div
      className='w-[220px] cursor-pointer rounded-md shadow-md overflow-hidden'
      onClick={() => {
        window.open(data?.link, '_blank')
      }}
    >
      <div className='p-2 bg-gray-500 text-center'>
        <span>{data?.link}</span>
      </div>
      <img
        src={data?.image}
        className='w-full h-[220px] object-cover '
        alt=''
      />
      <div className='p-2 bg-gray-200 text-center'>
        <span>{data?.title}</span>
      </div>
    </div>
  )
}
