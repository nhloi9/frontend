import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../Components/Layout/Header'
import LeftSide from '../Components/Story/LeftSide'
import RightSide from '../Components/Story/RightSide'
import { useSelector } from 'react-redux'

const StoriesPage = () => {
  const navigate = useNavigate()
  const { stories, type } = useSelector(state => state.stories)
  const { state } = useLocation()
  const [current, setCurrent] = useState(state?.current)
  useEffect(() => {
    navigate('/stories', {
      state: { current: null }
    })
  }, [navigate])

  return (
    <div>
      <Header />
      <div className='flex'>
        <LeftSide
          stories={stories}
          type={type}
          current={current}
          setCurrent={setCurrent}
        />
        {
          <RightSide
            current={current}
            setCurrent={setCurrent}
            stories={stories}
            type={type}
          />
        }
      </div>
    </div>
  )
}

export default StoriesPage
