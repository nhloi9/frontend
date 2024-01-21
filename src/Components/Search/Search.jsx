import { Button, Checkbox, Select } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { HiMiniUserGroup } from 'react-icons/hi2'
import { IoMdPhotos } from 'react-icons/io'
import { MdBorderAll, MdOutlinePublic, MdPeople } from 'react-icons/md'
import { defaulAvatar } from '../../Constants'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getApi } from '../../network/api'
import { useDispatch, useSelector } from 'react-redux'
import { postTypes } from '../../Reduxs/Types/postType'
import Posts from '../Home/Posts'
import { globalTypes } from '../../Reduxs/Types/globalType'
import { FaLock } from 'react-icons/fa'
import Avatar from '../Home/Avatar'
import { Country, State } from 'country-state-city'

const filters = [
  {
    type: 'all',
    icon: MdBorderAll,
    text: 'All'
  },
  {
    type: 'people',
    icon: MdPeople,
    text: 'People'
  },
  {
    type: 'post',
    icon: IoMdPhotos,
    text: 'Posts'
  },
  {
    type: 'group',
    icon: HiMiniUserGroup,
    text: 'Groups'
  }
]

const Search = () => {
  const { requests } = useSelector(state => state.friend)
  const { user } = useSelector(state => state.auth)

  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  let [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { posts } = useSelector(state => state.post)
  const dispatch = useDispatch()

  const friends = useMemo(() => {
    const acceptedRequests = requests?.filter(req => req?.status === 'accepted')
    return acceptedRequests.map(req => {
      return req?.senderId === user?.id ? req.receiver : req.sender
    })
  }, [requests, user?.id])

  const term = searchParams.get('query')
  const [type, setType] = useState('all')
  useEffect(() => {
    const search = async term => {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: true
        }
      })
      try {
        const [
          {
            data: { users }
          },
          {
            data: { posts }
          },
          {
            data: { groups }
          }
        ] = await Promise.all([
          getApi(`users/search`, { q: term.trim() }),
          getApi(`posts/search`, { q: term.trim() }),
          getApi(`groups/search`, { q: term.trim() })
        ])
        setUsers(users)
        dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: posts })
        setGroups(groups)
        dispatch({
          type: globalTypes.ALERT,
          payload: {
            loading: false
          }
        })
      } catch (error) {
        setUsers([])
        dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
        setGroups([])
        dispatch({
          type: globalTypes.ALERT,
          payload: {
            loading: false
          }
        })
      }
    }

    if (term && term.trim().length > 0) {
      search(term.trim())
    } else setUsers([])
  }, [term, dispatch])

  useEffect(() => {
    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [dispatch])
  return (
    <div className='pt-[60px] flex h-[100vh] '>
      {/* left */}
      <div className='w-[350px] px-2 h-full shadow-lg border-r  border-gray-200'>
        <h1 className='font-[600] text-[22px] my-3'>Search Result for</h1>

        <span className='text-gray-400'>{term}</span>
        <hr className='bg-gray-400 h-[1px] my-3' />
        <h1>Filter</h1>
        {filters.map((item, index) => (
          <div>
            <div
              onClick={() => setType(item.type)}
              key={index}
              className={` cursor-pointer flex gap-2 p-2 hover:bg-gray-200 rounded-md my-3 items-center ${
                type === item.type && 'bg-gray-200'
              }`}
            >
              <div
                className={`h-9 w-9 rounded-full  flex items-center justify-center  ${
                  type === item.type ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <item.icon className='!w-5 !h-5' />
              </div>
              <h1>{item.text}</h1>
            </div>
          </div>
        ))}
      </div>

      {/* right */}
      <div className='h-full  overflow-y-scroll w-[calc(100%-350px)]  bg-[#f0f2f5]'>
        {type === 'all' && (
          <div className='mx-auto my-4 max-w-[680px]'>
            {users?.length > 0 && (
              <div className='bg-white rounded-md p-3'>
                <h1 className='text-[20px]'>People</h1>
                <br />
                {users?.slice(0, 4)?.map(friend => (
                  <FriendCard
                    friends={friends}
                    isFriend={friends.find(item => item?.id === friend?.id)}
                    friend={friend}
                    navigate={navigate}
                  />
                ))}
                <Button
                  className='!w-full bg-gray-200 '
                  type='default'
                  onClick={() => {
                    setType('people')
                  }}
                >
                  <span className='font-[500]'>See all</span>
                </Button>
              </div>
            )}
            <br />

            <Posts posts={posts.slice(0, 10)} />
            {groups?.length > 0 && (
              <div className='bg-white rounded-md p-3'>
                <h1 className='text-[20px]'>Groups</h1>
                <br />
                {groups.slice(0, 5).map(group => (
                  <div className='rounded-md bg-white flex items-center justify-between  h-min p-3 my-1'>
                    <div
                      className='flex items-center  gap-5 '
                      // onClick={() => navigate('/groups/' + post?.group?.id)}
                    >
                      <img
                        src={group?.image?.url}
                        alt=''
                        className='w-20 h-20 rounded-md object-cover'
                      />
                      <div className='flex flex-col justify-center'>
                        <span className='font-bold'>{group?.name}</span>
                        <div>
                          <span className='text-gray-500 text-sm'>
                            <span>
                              {group?.privacy === 'public' ? (
                                <MdOutlinePublic className='!translate-y-[3px]' />
                              ) : (
                                <FaLock className='!translate-y-[3px]' />
                              )}
                            </span>
                            {' ' + group?.privacy + ' group'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      // className='w-[100px] '
                      type='default'
                      onClick={() => navigate('/groups/' + group?.id)}
                    >
                      View group
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {posts?.length === 0 &&
              groups?.length === 0 &&
              users?.length === 0 && (
                <div className='bg-white rounded-md h-[100px] flex items-center justify-center'>
                  <span className='font-[500]'>No results found</span>
                </div>
              )}
          </div>
        )}
        {type === 'people' && (
          <PeopleSearch friends={friends} navigate={navigate} users={users} />
        )}

        {type === 'post' && (
          <div className='mx-auto my-4 max-w-[680px]'>
            <Posts posts={posts} />

            {posts?.length === 0 && (
              <div className='bg-white rounded-md h-[100px] flex items-center justify-center'>
                <span className='font-[500]'>No results found</span>
              </div>
            )}
          </div>
        )}

        {type === 'group' && (
          <div className='mx-auto  my-4 max-w-[680px]'>
            {groups?.length > 0 && (
              <div className='bg-white rounded-md p-3'>
                <h1 className='text-[20px]'>Groups</h1>
                <br />
                {groups.map(group => (
                  <div className='rounded-md bg-white flex items-center justify-between  h-min p-3 my-1'>
                    <div
                      className='flex items-center  gap-5 '
                      // onClick={() => navigate('/groups/' + post?.group?.id)}
                    >
                      <img
                        src={group?.image?.url}
                        alt=''
                        className='w-20 h-20 rounded-md object-cover'
                      />
                      <div className='flex flex-col justify-center'>
                        <span className='font-bold'>{group?.name}</span>
                        <div>
                          <span className='text-gray-500 text-sm'>
                            <span>
                              {group?.privacy === 'public' ? (
                                <MdOutlinePublic className='!translate-y-[3px]' />
                              ) : (
                                <FaLock className='!translate-y-[3px]' />
                              )}
                            </span>
                            {' ' + group?.privacy + ' group'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      // className='w-[100px] '
                      type='default'
                      onClick={() => navigate('/groups/' + group?.id)}
                    >
                      View group
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {groups?.length === 0 && (
              <div className='bg-white rounded-md h-[100px] flex items-center justify-center'>
                <span className='font-[500]'>No results found</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const PeopleSearch = ({ users, friends, navigate }) => {
  const countryOptions = Country.getAllCountries().map(item => ({
    value: item.isoCode,
    label: item.name
  }))
  const [friend, setFriend] = useState(null)
  const [stateOptions, setStateOptions] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)

  const stateFilter = arr => {
    if (!selectedState) return arr
    return arr.filter(item => item?.detail?.state === selectedState)
  }

  const countryFilter = arr => {
    if (!selectedCountry) return arr
    return arr.filter(item => item?.detail?.country === selectedCountry)
  }

  const friendFilter = arr => {
    if (!friend) return arr
    if (friend === 1) {
      return arr.filter(item => friends.find(i => i.id === item.id))
    }
    if (friend === 2)
      return arr.filter(item =>
        item.friends.find(i => friends.find(element => element.id === i.id))
      )
  }

  const filterUsers = friendFilter(countryFilter(stateFilter(users)))

  useEffect(() => {
    setStateOptions([])
    setSelectedState(undefined)
    if (selectedCountry) {
      setStateOptions(
        State.getStatesOfCountry(selectedCountry).map(item => ({
          value: item.isoCode,
          label: item.name
        }))
      )
    } else setStateOptions([])
  }, [selectedCountry])
  return (
    <div className='w-full relative'>
      <div className='top-0 w-full z-10 py-5 bg-white shadow-md sticky'>
        <div className='mx-auto w-[80%] max-w-[700px]'>
          <h1 className='font-[700] text-[23px]'>People</h1>

          <div className='flex gap-4 mt-2'>
            <Button
              className='bg-gray-200'
              disabled={!selectedCountry && !selectedState && !friend}
              onClick={() => {
                setFriend(null)
                setSelectedCountry(null)
                setSelectedState(null)
              }}
            >
              Clear filter
            </Button>

            <Select
              className='!w-[150px]'
              allowClear
              placeholder='Friend'
              optionFilterProp='children'
              onChange={value => {
                setFriend(value)
              }}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                {
                  value: 1,
                  label: 'My Friends'
                },
                {
                  value: 2,
                  label: 'Friends of Friends'
                }
              ]}
            />

            <Select
              value={selectedCountry}
              className='!w-[150px]'
              showSearch
              allowClear
              placeholder='Country'
              optionFilterProp='children'
              onChange={value => {
                setSelectedCountry(value)
              }}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={countryOptions}
            />
            <Select
              value={selectedState}
              className='!w-[150px]'
              showSearch
              allowClear
              placeholder='City'
              optionFilterProp='children'
              onChange={value => {
                setSelectedState(value)
              }}
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={stateOptions}
            />
          </div>
        </div>
      </div>
      <div className='mx-auto mb-3 max-w-[680px] my-4'>
        {filterUsers?.length > 0 && (
          <div>
            {filterUsers?.map(user => (
              <FriendCard
                card={true}
                friends={friends}
                isFriend={friends.find(item => item?.id === user?.id)}
                friend={user}
                navigate={navigate}
              />
            ))}
          </div>
        )}
        {filterUsers?.length === 0 && (
          <div className='bg-white rounded-md h-[100px] flex items-center justify-center'>
            <span className='font-[500]'>No results found</span>
          </div>
        )}
      </div>
    </div>
  )
}

const FriendCard = ({ friend, navigate, isFriend, friends, card }) => {
  const mutualFriends = friend.friends?.filter(item =>
    friends.find(user => user?.id === item?.id)
  )
  return (
    <div
      className={`flex  items-center mb-3 gap-2 bg-white rounded-md ${
        card && ' p-4 '
      }`}
    >
      <Avatar
        src={friend?.avatar?.url ?? defaulAvatar}
        size={50}
        onClick={() => navigate('/profile/' + friend?.id)}
        className='cursor-pointer'
      />
      <div className='flex flex-col justify-center'>
        <h1
          className='text-[17px] cursor-pointer hover:underline'
          onClick={() => navigate('/profile/' + friend?.id)}
        >
          {friend?.firstname + ' ' + friend?.lastname}
        </h1>
        <p className=' text-gray-500'>
          {isFriend ? 'Friend' : friend?.friends?.length + ' friends'}
          {friend?.detail?.country && (
            <span className='max-w-[calc(100%-30px)]'>
              {' '}
              . Live in{' '}
              {friend?.detail?.state &&
                State.getStateByCodeAndCountry(
                  friend?.detail?.state,
                  friend?.detail?.country
                )?.name + ', '}
              {Country.getCountryByCode(friend?.detail?.country)?.name}
            </span>
          )}
        </p>
        <p className='text-gray-500'>
          {mutualFriends?.length + ' mutual friends'}
        </p>
        {/* <p>{text}</p> */}
      </div>
    </div>
  )
}

export default Search
