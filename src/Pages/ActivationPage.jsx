import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { activeAcountAction } from '../Reduxs/Actions/authAction'
import toast from 'react-hot-toast'
import { getApi } from '../network/api'

const ActivationPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useParams()
  const { loading } = useSelector(state => state.alert)
  const { isLogin } = useSelector(state => state.auth)

  useEffect(() => {
    if (loading === false) {
      getApi(`users/active-acount/${token}`)
        .then(({ msg }) => {
          toast.success(msg)
        })
        .catch(err => toast.error(err))
    }
  }, [loading, isLogin, dispatch, navigate, token])
  return <div></div>
}

export default ActivationPage
