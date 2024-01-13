import { Avatar, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { HiMiniUserGroup } from 'react-icons/hi2'
import { IoMdPhotos } from 'react-icons/io'
import { MdBorderAll, MdPeople } from 'react-icons/md'
import { defaulAvatar } from '../../Constants'
import { useSearchParams } from 'react-router-dom'
import { getApi } from '../../network/api'
import { useDispatch, useSelector } from 'react-redux'
import { postTypes } from '../../Reduxs/Types/postType'
import Posts from '../Home/Posts'

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
  const [users, setUsers] = useState([])
  let [searchParams, setSearchParams] = useSearchParams()
  const { posts } = useSelector(state => state.post)
  const dispatch = useDispatch()

  const term = searchParams.get('query')
  const [type, setType] = useState('all')
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

  useEffect(() => {
    if (term && term.trim().length > 0) {
      try {
        getApi(`posts/search`, { q: term.trim() })
          .then(({ data: { posts } }) => {
            dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: posts })
          })
          .catch(error => console.log(error))
      } catch (error) {
        setUsers([])
      }
    } else setUsers([])
  }, [term])
  useEffect(() => {
    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [])
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
      <div className='h-full  overflow-y-scroll w-[calc(100%-350px)] p-4 bg-[#f0f2f5]'>
        {type === 'all' && (
          <div className='mx-auto max-w-[680px]'>
            <div className='bg-white rounded-md p-3'>
              <h1 className='text-[20px]'>People</h1>
              <br />
              {users?.slice(0, 4)?.map(user => (
                <div className='flex  items-center mb-3 gap-2'>
                  <Avatar src={user?.avatar?.url ?? defaulAvatar} size={50} />
                  <div className='flex flex-col justify-center'>
                    <h1 className='text-[17px]'>
                      {user?.firstname + ' ' + user?.lastname}
                    </h1>
                    {/* <p>{text}</p> */}
                  </div>
                </div>
              ))}
              <Button className='!w-full bg-gray-200 ' type='default'>
                <span className='font-[500]'> See all</span>
              </Button>
            </div>
            <br />

            <Posts posts={posts} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
