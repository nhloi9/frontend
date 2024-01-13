import React from 'react'
import PostCard from '../PostCard/PostCard'

const Posts = ({ posts, type }) => {
  return (
    <div>
      {/* <div className='bg-white h-10 w-full'> */}
      {/* <audio
        controls
        className='w-full h-12 object-contain'
        crossOrigin='anonymous'
        src='https://cdns-preview-c.dzcdn.net/stream/c-c22d9b24e9119b7e73168c97dc024c54-1.mp3'
      /> */}
      {/* </div> */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} type={type} />
      ))}
    </div>
  )
}

export default Posts
