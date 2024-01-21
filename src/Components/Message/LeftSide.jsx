import { Avatar, Button, Input, Modal } from 'antd'
import moment from 'moment'

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MdSearch } from 'react-icons/md'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { GrFormPreviousLink } from 'react-icons/gr'
import { IoCreateOutline } from 'react-icons/io5'
import InputEmoji from 'react-input-emoji'

import {
  checkConversationOnline,
  getImageOfConversation,
  getNameOfConversation
} from '../../utils/conversation'
import { useNavigate } from 'react-router-dom'
import { getApi, postApi } from '../../network/api'
import { defaulAvatar, defaultImageConversation } from '../../Constants'
import { MultiSelect } from 'react-multi-select-component'
import { addMessage } from '../../Reduxs/Actions/conversationAction '
import toast from 'react-hot-toast'
import { socket } from '../../socket'

const LeftSide = ({ id }) => {
  const navigate = useNavigate()
  const onlineUsers = useSelector(state => state.onlines)
  // const { active } = useSelector(state => state.conversation)
  const { user } = useSelector(state => state.auth)
  const [term, setTerm] = useState('')
  const [users, setUsers] = useState([])
  const [type, setType] = useState('conversations')
  const { conversations } = useSelector(state => state.conversations)
  const [openCreateGroup, setOpenCreateGroup] = useState(false)
  const { requests } = useSelector(state => state.friend)

  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      return (
        new Date(b.lastMessage?.createdAt).getTime() -
        new Date(a?.lastMessage?.createdAt).getTime()
      )
    })
  }, [conversations])

  // const onlineList = useSelector(state => state.online)

  const dispatch = useDispatch()

  useEffect(() => {
    if (term && term.trim().length > 0) {
      try {
        getApi(`users/search`, { q: term.trim() })
          .then(response => {
            setUsers(response.data.users)
          })
          .catch(error => console.log(error))
      } catch (error) {
        setUsers([])
      }
    } else setUsers([])
  }, [term])
  const handleClickUser = user => {
    postApi('/conversations', {
      members: [user.id]
    })
      .then(({ data: { conversation } }) => {
        navigate(`/message/${conversation?.id}`)
        setType('conversations')
        setTerm('')
      })
      .catch(error => console.log(error))
    // dispatch(createConversation(user))
  }
  console.log(users)

  const checkOnline = user => {
    // return onlineList?.includes(user)
  }
  const checkFollowing = userId => {
    // return user.following?.find(item => item._id === userId)
  }
  return (
    <div className='w-[350px] h-screen  border-r border-gray-400 pt-[60px] px-4'>
      <div className='flex items-center justify-between px-1'>
        <h1 className='font-[800] text-[23px] pt-3 pb-3 '>Chats</h1>
        <IoCreateOutline
          size={24}
          className='cursor-pointer'
          onClick={() => setOpenCreateGroup(true)}
        />
      </div>
      {/* <form action='' className=' px-2 relative '>
        <input
          type='text'
          required
          className=' rounded-md block w-full h-[40px]  focus:border-blue-500 focus:border focus:outline-none  px-1 bg-gray-100 '
          placeholder='Search '
        />
        <CiSearch className='absolute top-3 right-3' />
      </form> */}
      {/* <Search message={true} /> */}
      <div className='relative w-full flex items-center '>
        <GrFormPreviousLink
          className={`${
            type === 'search' ? 'block' : 'hidden'
          } !text-gray-400 cursor-pointer`}
          size={24}
          onClick={() => {
            setType('conversations')
            setTerm('')
          }}
        />
        <div className='w-full relative'>
          <input
            placeholder='Search'
            className=' bg-gray-100 block w-full h-[35px] py-1  pl-8 pr-6 appearance-none rounded-[15px] focus:outline-none  '
            type='text'
            value={term}
            onChange={e => {
              setTerm(e.target.value)
            }}
            onClick={() => {
              setType('search')
            }}
          />
          <MdSearch
            className='!absolute top-[6px] left-1 !text-gray-500'
            size={25}
          />
          {term && (
            <IoCloseCircleSharp
              size={25}
              className='!text-gray-400 absolute top-[5px] right-1 cursor-pointer'
              onClick={() => {
                setTerm('')
              }}
            />
          )}
        </div>
      </div>
      <div className='w-full  h-[calc(100vh-180px)]  pt-2 scroll-min overflow-y-scroll'>
        {type === 'conversations'
          ? sortedConversations.map(con => {
              // const other = con.members.find(item => item._id !== user._id)
              return (
                <ConversationCard
                  seen={
                    con?.members?.find(item => item?.userId === user.id)?.isSeen
                  }
                  navigate={navigate}
                  // online={checkOnline(other._id)}
                  active={id === con.id?.toString()}
                  conversation={con}
                  key={con.id}
                  // other={other}
                  userId={user?.id}
                  dispatch={dispatch}
                  online={checkConversationOnline(con, user?.id, onlineUsers)}
                  // following={checkFollowing(other._id)}
                />
              )
            })
          : users.map(
              item =>
                item?.id !== user?.id && (
                  <div
                    className='my-1'
                    onClick={() => {
                      handleClickUser(item)
                    }}
                  >
                    <UserCard user={item} msg={true} />
                  </div>
                )
            )}
      </div>
      <Invite
        // handleInvite={handleInvite}
        friends={friends}
        isModalOpen={openCreateGroup}
        handleCancel={() => setOpenCreateGroup(false)}
      />
    </div>
  )
}

const UserCard = ({ user }) => {
  return (
    <div className='w-full p-2 flex gap-1 items-center  hover:bg-gray-100 rounded-md cursor-pointer'>
      <Avatar src={user?.avatar?.url ?? defaulAvatar} />
      <p>
        {user?.firstname} {user?.lastname}
      </p>
    </div>
  )
}

const ConversationCard = ({
  online,
  seen,
  conversation,
  other,
  active,
  userId,
  navigate
}) => {
  console.log({ seen, online })
  // const indexOfOther = conversation?.members?.indexOf(other)
  // const indexOfUser = [0, 1].find(index => index !== indexOfOther)
  console.log({ conversation, imge: getImageOfConversation(conversation) })
  return (
    <>
      {conversation.lastMessage && (
        <div
          className={`w-full hover:bg-[#ebf5ff] flex justify-start rounded-lg  items-start p-1 my-2 cursor-pointer ${
            active && 'bg-[#ebf5ff]'
          }`}
          onClick={() => {
            // dispatch(seenConversation(conversation._id, other._id))
            // dispatch({
            //   // type: CONVERSATION_TYPES.ACTIVE_CONVERSATION,
            //   payload: { _id: conversation._id, other }
            // })
            navigate('/message/' + conversation?.id)
          }}
        >
          <div className='relative'>
            {online && (
              <div className='w-3 h-3 bg-green-700 z-10 border border-white rounded-full absolute bottom-[2px] right-[2px]'></div>
            )}
            {getImageOfConversation(conversation, userId).length === 0 ? (
              <Avatar size={40} src={defaultImageConversation} />
            ) : getImageOfConversation(conversation, userId).length === 1 ? (
              <Avatar
                size={40}
                src={
                  getImageOfConversation(conversation, userId)[0] ??
                  defaulAvatar
                }
              />
            ) : (
              <div className='w-[40px] h-[40px] relative'>
                <img
                  alt=''
                  className='w-[27px] h-[27px] border-white block  rounded-full !absolute bottom-0 left-0 !z-20 !shadow-lg border'
                  src={
                    getImageOfConversation(conversation, userId)[0] ??
                    defaulAvatar
                  }
                ></img>
                <Avatar
                  size={26}
                  className='!absolute top-0 right-0'
                  src={
                    getImageOfConversation(conversation, userId)[1] ??
                    defaulAvatar
                  }
                />
              </div>
            )}
            {/* {following && (
              <div
                className={`${
                  online ? 'bg-green-500 ' : 'bg-gray-300'
                } w-4 h-4   rounded-full absolute top-[2px] right-0`}
              ></div>
            )} */}
          </div>
          <div className='mx-1 w-full flex  justify-between items-center'>
            <div className='w-full flex flex-col justify-center'>
              <p className='font-[600]'>
                {getNameOfConversation(conversation, userId)}
              </p>
              <p
                className={`${
                  !seen
                    ? 'text-black drop-shadow-2xl font-[500] '
                    : 'text-gray-500'
                } text-sm`}
              >
                {conversation?.lastMessage?.member?.userId === Number(userId)
                  ? 'you'
                  : conversation?.lastMessage?.member?.user?.firstname}
                :{' '}
                {conversation.lastMessage?.text?.length > 15
                  ? conversation.lastMessage?.text?.slice(0, 15) + '...'
                  : conversation.lastMessage?.text}
                {' *'}
                {moment(conversation?.lastMessage?.createdAt).fromNow()}
              </p>
            </div>
            {!seen && <div className='w-3 h-3 rounded-full bg-blue-500'></div>}
          </div>
        </div>
      )}
    </>
  )
}

const Invite = ({ isModalOpen, handleCancel, friends }) => {
  const options = friends?.map(friend => ({
    label: friend.firstname + ' ' + friend.lastname,
    value: friend.id
  }))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [members, setMembers] = useState([])
  const [message, setMessage] = useState('')

  const handleInvite = async () => {
    try {
      const {
        data: { conversation }
      } = await postApi('/conversations', {
        members: members.map(item => item?.value),
        name
      })

      const {
        data: { message: messageData }
      } = await postApi('/messages', {
        conversationId: conversation.id,
        text: message,
        files: []
      })
      socket.emit('addMessage', {
        message: messageData
      })
      dispatch(addMessage(messageData))
      navigate('/message/' + conversation?.id)
      handleCancel && handleCancel()
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <Modal
      maskClosable={false}
      title='Create group chat'
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <div className='flex items-center justify-between'>
          <div className={'!w-[70%] z-0'}>
            <InputEmoji
              // cleanOnEnter
              placeholder='Type a message'
              maxLength={'200px'}
              value={message}
              onChange={setMessage}
              // onEnter={() => {
              //   console.log(3)
              // }}
            />
          </div>

          <Button
            key='submit'
            type='primary'
            // loading={loading}
            disabled={members?.length < 2 || !(message?.trim()?.length > 0)}
            onClick={handleInvite}
          >
            Add
          </Button>
        </div>
      ]}
    >
      <div className='min-h-[40vh]'>
        <br />
        <Input
          placeholder='Enter your name of group'
          showCount
          maxLength={20}
          value={name}
          onChange={e => {
            setName(e.target.value)
          }}
        />
        <br />
        <br />
        <MultiSelect
          overrideStrings={{
            selectSomeItems: 'Add to group least two friends'
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
                    src={
                      friends.find(item => item.id === option.value)?.avatar
                        ?.url
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
          value={members}
          onChange={setMembers}
          labelledBy='Select'
        />
      </div>
    </Modal>
  )
}

export default LeftSide
