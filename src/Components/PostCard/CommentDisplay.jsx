import React, { useState } from 'react'
import CommentCard from './CommentCard'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const CommentDisplay = ({ comment, post, answers }) => {
  const [showAnsweres, setShowAnswres] = useState(false)
  console.log({ comment })
  return (
    <div className='mb-5'>
      <CommentCard comment={comment} post={post} />
      {answers?.length > 0 && (
        <div
          className='flex items-center mx-[30px] gap-1 cursor-pointer text-blue-800 !text-sm'
          onClick={() => setShowAnswres(!showAnsweres)}
        >
          {showAnsweres ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
          <span className='text-sm'>{answers?.length} replies</span>
        </div>
      )}
      {showAnsweres && (
        <div className='ml-[30px]'>
          {answers &&
            answers.map(cm => (
              <CommentCard key={cm?.id} comment={cm} post={post} />
            ))}
        </div>
      )}
    </div>
  )
}

export default CommentDisplay
