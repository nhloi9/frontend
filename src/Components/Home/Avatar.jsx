import React from 'react'

const Avatar = ({ src, size, onClick }) => {
  return (
    <img
      onClick={onClick}
      src={src}
      alt='avatar'
      style={{
        width: `${size}px`,
        height: `${size}px`
      }}
      className={` block rounded-full border-gray-300 border object-cover cursor-pointer`}
    />
  )
}

export default Avatar
