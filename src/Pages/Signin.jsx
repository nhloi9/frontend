import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Checkbox, Form, Input } from 'antd'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { siginAction } from '../Reduxs/Actions/authAction'

const Signin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isLogin } = useSelector(state => state.auth)

  const [emailContinue, setEmailContinue] = useState(false)
  // useEffect(() => {
  //   i18n.changeLanguage('vi')
  // }, [])

  const onFinish = values => {
    dispatch(siginAction(values))
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  useEffect(() => {
    if (isLogin) navigate('/')
  }, [isLogin, navigate])

  return (
    <div
      className=' min-h-screen  !bg-no-repeat  flex items-center justify-center '
      style={{
        background: 'url(images/giphy.gif) no-repeat',
        backgroundSize: 'cover'
      }}
    >
      {!emailContinue ? (
        <div className='bg-white dark:bg-dark-200 dark:text-white md:rounded w-full  md:w-[450px] p-16 min-h-screen md:min-h-[80vh] shadow flex flex-col justify-between'>
          <h1 className='text-[28px] font-[700] w-[70%]'>
            {/* Sign in to explore your new world */}
            {t('signin-title')}
          </h1>

          <div>
            <div
              className='rounded-3xl h-12  border-gray-600  dark:border-gray-50 border-[2px] cursor-pointer flex items-center'
              onClick={() => {
                window.location.href = 'http://localhost:3333/users/google/url'
              }}
            >
              <img
                src='https://static.tacdn.com/img2/google/G_color_40x40.png'
                className='w-[20xp] h-[20px] ml-6'
                alt=''
              />
              <span className='w-full text-center'>{t('signin-google')}</span>
            </div>
            <br />
            <div
              className='rounded-3xl h-12  border-gray-600 dark:border-gray-50 border-[2px] cursor-pointer flex items-center'
              onClick={() => setEmailContinue(true)}
            >
              <img
                src='https://static.tacdn.com/img2/google/G_color_40x40.png'
                className='w-[20xp] h-[20px] ml-6'
                alt=''
              />
              <span className='w-full text-center'>{t('signin-email')} </span>
            </div>
          </div>
          <div className='px-5 flex justify-center'>
            <span className=' text-center text-sm'>
              By proceeding, you agree to our Terms of Use and confirm you have
              read our Privacy and Cookie Statement.
            </span>
          </div>
        </div>
      ) : (
        <div
          className='dark:bg-dark-200
         dark:text-white bg-white md:rounded w-full  md:w-[450px] p-16 min-h-screen md:min-h-[80vh] shadow flex flex-col justify-between relative'
        >
          <MdArrowBackIosNew
            className='absolute top-5 left-5 cursor-pointer '
            // size={'25px'}
            onClick={() => setEmailContinue(false)}
          />
          <h1 className='text-[28px] font-[700] w-[70%]'>
            {/* Sign in to explore your new world */}
            {t('signin-email-welcome')}
          </h1>
          <Form
            layout='vertical'
            name='basic'
            labelCol={{
              span: 16
            }}
            wrapperCol={{
              span: 32
            }}
            style={{
              maxWidth: 600
            }}
            initialValues={{
              remember: true
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
          >
            <Form.Item
              label='Email address'
              hasFeedback
              validateDebounce={100}
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input email!'
                },
                {
                  type: 'email',
                  message: 'email invalid'
                }
              ]}
            >
              <Input placeholder='name@gmail.com' />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]}
            >
              <Input.Password placeholder='******' />
              {/* <Button type='link' className='!-mt-3'>
                <span
                  className='text-[13px] !text-red-400'
                  onClick={() => {
                    navigate('/forget-password')
                  }}
                >
                  Forgot password
                </span>
              </Button> */}
            </Form.Item>

            <Form.Item
              name='remember'
              valuePropName='checked'
              wrapperCol={{
                offset: 8,
                span: 16
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16
              }}
            >
              <Button
                type='primary'
                className='bg-blue-500 hover:bg-blue-400'
                htmlType='submit'
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
          <div className='w-full flex  items-center gap-1'>
            <div className='border-t flex-1 '></div>
            <h1 className=''>Not a member? </h1>
            <h1
              className='cursor-pointer text-blue-500 hover:text-blue-400'
              onClick={() => navigate('/signup')}
            >
              Sign up
            </h1>
            <div className='border-t flex-1 '></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Signin
