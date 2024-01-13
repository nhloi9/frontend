import React, { useEffect, useMemo, useState } from 'react'
import { getApi } from '../../network/api'
import { useSelector } from 'react-redux'
import FriendCard from './FriendCard'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { filterFriends } from '../../utils/other'

export const RightSide = () => {
  const { type } = useParams()
  const [suggestions, setSuggestions] = useState([])
  useEffect(() => {
    getApi('/friend-requests/suggests')
      .then(({ data: { suggests } }) => setSuggestions(suggests))
      .catch(err => {})
  }, [])
  const { requests } = useSelector(state => state.friend)
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()

  const receives = useMemo(() => {
    const receiveRequests = requests?.filter(
      req => req?.status === 'waiting' && req?.senderId !== user?.id
    )
    return receiveRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])

  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])

  console.log(receives)

  console.log({ receives })
  return (
    <>
      {type === undefined &&
        (suggestions?.length > 0 || receives?.length > 0 ? (
          <div className=' h-full bg-[#f0f2f5]  pt-[30px] px-[20px]'>
            {receives?.length > 0 && (
              <>
                <div className=' pb-[10px]'>
                  <div className='w-full flex justify-between'>
                    <h1 className='font-[600] text-[22px]'>Friend Requests</h1>
                    <Button
                      type='link'
                      onClick={() => {
                        navigate('/friends/requests')
                      }}
                    >
                      See all
                    </Button>
                  </div>
                  <div className='my-2 flex  flex-wrap gap-2'>
                    {receives?.slice(0, 10)?.map(item => (
                      <FriendCard friend={item} key={item?.id} />
                    ))}
                  </div>
                </div>
                {/* <br /> */}
                {suggestions?.length > 0 && (
                  <hr className='h-[1px] bg-gray-400 pb-5' />
                )}
              </>
            )}

            {suggestions?.length > 0 && (
              <div className=' '>
                <div className='w-full flex justify-between'>
                  <h1 className='font-[600] text-[22px]'>
                    People you may know
                  </h1>
                  <Button
                    type='link'
                    onClick={() => {
                      navigate('/friends/suggests')
                    }}
                  >
                    See all
                  </Button>
                </div>

                <div className='my-2 flex  flex-wrap gap-2'>
                  {suggestions?.slice(0, 20)?.map(item => (
                    <FriendCard friend={item} key={item?.id} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <NoSuggestOrRequest />
        ))}
      {type === 'requests' &&
        (receives?.length > 0 ? (
          <div className=' h-full bg-[#f0f2f5] pt-[30px] px-[20px]'>
            <div>
              <h1 className='font-[600] text-[22px]'>Friend Requests</h1>
              <div className='my-2 flex  flex-wrap gap-2'>
                {receives?.map(item => (
                  <FriendCard friend={item} key={item?.id} />
                ))}
              </div>
            </div>
            <br />
          </div>
        ) : (
          <NoSuggestOrRequest />
        ))}
      {type === 'suggests' &&
        (suggestions?.length > 0 ? (
          <div className=' h-full bg-[#f0f2f5] pt-[30px] px-[20px]'>
            <div>
              <h1 className='font-[600] text-[22px]'>Friend Suggestions</h1>
              <div className='my-4 flex  flex-wrap gap-2'>
                {suggestions?.map(item => (
                  <FriendCard friend={item} key={item?.id} />
                ))}
              </div>
            </div>
            <br />
          </div>
        ) : (
          <NoSuggestOrRequest />
        ))}

      {type === 'all' &&
        (friends?.length > 0 ? (
          <AllFriends friends={friends} />
        ) : (
          <NoSuggestOrRequest type={'all'} />
        ))}
    </>
  )
}

const AllFriends = ({ friends }) => {
  const [term, setTerm] = useState('')
  // const filterFriends = () => {
  //   if (!term?.trim()) return friends
  //   const tokens = term
  //     ?.trim()
  //     .split(' ')
  //     ?.filter(item => item !== '')
  //   return friends?.filter(friend =>
  //     tokens?.every(token =>
  //       (friend?.firstname + ' ' + friend?.lastname)
  //         .normalize('NFD')
  //         .replace(/[\u0300-\u036f]/g, '')
  //         .toLowerCase()
  //         ?.includes(
  //           token
  //             ?.normalize('NFD')
  //             .replace(/[\u0300-\u036f]/g, '')
  //             .toLowerCase()
  //         )
  //     )
  //   )
  // }
  return (
    <div className=' h-full bg-[#f0f2f5] pt-[30px] px-[20px]'>
      <div>
        <div className='flex gap-4 items-center mb-8'>
          <div className='flex items-center gap-1'>
            <h1 className='font-[600] text-[22px]'>All Friends</h1>{' '}
            <span className='text-gray-400'>({friends?.length} friends)</span>
          </div>
          <input
            onChange={e => setTerm(e.target.value)}
            value={term}
            placeholder='🔍 Search friends'
            type='text'
            className='block w-[250px] h-[40px] rounded-3xl px-3 bg-white border-none focus:outline-none '
          />
        </div>
        <div className='my-2 flex  flex-wrap gap-2'>
          {filterFriends(term, friends)?.map(item => (
            <FriendCard friend={item} key={item?.id} />
          ))}
        </div>
      </div>
      <br />
    </div>
  )
}

const NoSuggestOrRequest = ({ type }) => {
  return (
    <div className=' h-full bg-[#f0f2f5] pt-[30px] px-[20px] flex items-center justify-center'>
      <div className='flex flex-col items-center'>
        <img
          src={require('../../assets/images/no-friend-requests.png')}
          alt=''
          className='w-[112px] '
        />
        <h1 className='text-gray-400'>
          {type === 'all'
            ? "When you become friends with people on Facebook, they'll appear here."
            : "When you have friend requests or suggestions, you'll see them here."}
        </h1>
      </div>
    </div>
  )
}
