import React from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

const PhotoPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const id = searchParams.get('id')
  console.log(location.state)
  return <div>PhotoPage</div>
}

export default PhotoPage
