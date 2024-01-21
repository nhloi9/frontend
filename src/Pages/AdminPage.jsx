import React, { useEffect } from 'react'
import Header from '../Components/Layout/Header'
import Leftside from '../Components/Admin/Leftside'
import RightSide from '../Components/Admin/RightSide'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminPage = () => {
  const { user } = useSelector(state => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (user?.role !== 'admin') navigate('/')
  }, [user?.role, navigate])
  return (
    <div>
      <Header />
      <div className='pt-[60px] bg-gray-200 min-h-[100vh]  flex relative'>
        <Leftside />
        <RightSide />
      </div>
    </div>
  )
}

export default AdminPage
