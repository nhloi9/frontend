import { Avatar, Modal } from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { reacts } from '../../Constants'

const ShowReacts = ({ reactsArray, open, onCancel }) => {
  const navigate = useNavigate()
  const [type, setType] = useState('all')
  return (
    <Modal
      destroyOnClose={true}
      open={open}
      onCancel={onCancel}
      footer={[]}
      maskClosable={true}
    >
      <div className='flex py-1 border-b mb-2 items-center gap-3'>
        <div
          className={`w-14 h-14 flex items-center justify-center hover:bg-gray-100  cursor-pointer ${
            type === 'all' && 'border-b-[2px] border-blue-500 '
          }`}
          onClick={() => setType('all')}
        >
          <span
            className={`${
              type !== 'all' ? 'text-gray-400' : 'text-blue-500'
            } font-[500]`}
          >
            All
          </span>
        </div>

        {Object.keys(classifyReacts(reactsArray))
          ?.sort((a, b) => {
            return (
              classifyReacts(reactsArray)[b]?.length -
              classifyReacts(reactsArray)[a]?.length
            )
          })
          .map(item => (
            <div
              className={`w-14 h-14 flex items-center justify-center hover:bg-gray-100  cursor-pointer ${
                type === item && 'border-b-[2px] border-blue-500 '
              }`}
              onClick={() => {
                setType(item)
                console.log(item)
              }}
            >
              <img
                src={
                  reacts.find(i => i.id.toString() === item?.toString())?.icon
                }
                alt=''
                className={`w-[20px] h-[20px] rounded-full  right-0 bottom-0`}
              />
            </div>
          ))}
      </div>
      <div className='h-[50vh] overflow-y-scroll scroll-min flex flex-col gap-1'>
        {(type === 'all'
          ? reactsArray
          : classifyReacts(reactsArray)[type]
        )?.map(react => (
          <div className='flex gap-2 items-center '>
            <Link to={`/profile/${react?.user?.id}`} className=' relative'>
              <Avatar src={react?.user?.avatar?.url} size={'large'} />
              <img
                src={react?.react?.icon}
                alt=''
                className={`absolute w-[15px] h-[15px] rounded-full  right-0 bottom-0`}
              />
            </Link>

            <span
              onClick={() => navigate('/profile/' + react?.user?.id)}
              className='cursor-pointer'
            >
              {react?.user?.firstname + ' ' + react?.user?.lastname}
            </span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

function classifyReacts (reactsArray) {
  let reactsTop = {}
  reactsArray.forEach(item => {
    if (reactsTop[item?.react?.id]) {
      reactsTop[item?.react?.id].push(item)
    } else reactsTop[item?.react?.id] = [item]
  })

  // let reactsTopSorted = Object.keys(reactsTop).sort((a, b) => {
  //   return reactsArray[b] - reactsTop[a]
  // })
  // const array = reactsTopSorted?.map(item=>(
  //   return {
  //     icon:
  //   }
  // ))

  return reactsTop
}

export default ShowReacts
