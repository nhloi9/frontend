import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
function Protected ({ children }) {
  useEffect(() => {
    console.log('protected mout')
    return () => console.log('protected unmout')
  })
  const { loading } = useSelector(state => state.alert)
  const { isLogin } = useSelector(state => state.auth)
  if (!loading && !isLogin) {
    return <Navigate to='/signin' replace />
  }
  if (loading && !isLogin) {
    return null
  }
  return children
}
export default Protected
