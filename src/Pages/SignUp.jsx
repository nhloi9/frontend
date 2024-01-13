import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Input } from 'antd'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signupAction } from '../Reduxs/Actions/authAction'
import { globalTypes } from '../Reduxs/Types/globalType'
import { postApi } from '../network/api'

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { isLogin } = useSelector(state => state.auth)
  const [form] = Form.useForm()

  const [emailContinue, setEmailContinue] = useState(false)

  const onFinish = async values => {
    // dispatch(signupAction(values))
    // form.resetFields()
    // form.setFields([
    //   {
    //     name: 'email',
    //     errors: ['Please enter a valid email address']
    //   }
    // ])
    try {
      dispatch({ type: globalTypes.ALERT, payload: { loading: true } })
      const { msg } = await postApi('/users/register', values)
      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: false, success: msg }
      })
      form.resetFields()
      navigate('/signin')
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: { loading: false, error }
      })
    }
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
        background: 'url(images/background_login.webp) no-repeat',
        backgroundSize: 'cover'
      }}
    >
      {!emailContinue ? (
        <div className='bg-white md:rounded w-full  md:w-[450px] p-16 min-h-screen md:min-h-[80vh] shadow flex flex-col justify-between'>
          <h1 className='text-[28px] font-[700] w-[70%]'>
            {/* Sign in to explore your new world */}
            {t('signup-title')}
          </h1>

          <div>
            <div
              className='rounded-3xl h-12  border-black border-[2px] cursor-pointer flex items-center'
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
              className='rounded-3xl h-12  border-black border-[2px] cursor-pointer flex items-center'
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
        <div className='bg-white md:rounded w-full  md:w-[450px] p-16 min-h-screen md:min-h-[80vh] shadow flex flex-col justify-between relative'>
          <MdArrowBackIosNew
            className='absolute top-5 left-5 cursor-pointer '
            // size={'25px'}
            onClick={() => setEmailContinue(false)}
          />
          <h1 className='text-[28px] font-[700] w-[70%]'>
            {/* Sign in to explore your new world */}
            {t('signup-email-welcome')}
          </h1>
          <Form
            form={form}
            layout='vertical'
            name='basic'
            // labelCol={{
            //   span: 16
            // }}
            // wrapperCol={{
            //   span: 32
            // }}
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
            {/* <Form.Item
              label='BirthDate'
              style={{
                marginBottom: 0
              }}
            > */}
            <Form.Item
              name='firstname'
              label='First name'
              validateDebounce={200}
              rules={[
                {
                  required: true,
                  message: false
                },
                {
                  max: 10,
                  message: 'The first name must be less than 15 characters'
                }
              ]}
              style={{
                display: 'inline-block',
                width: 'calc(50% - 8px)'
              }}
            >
              <Input placeholder='Input your first name' />
            </Form.Item>
            <Form.Item
              name='lastname'
              label='Last name'
              rules={[
                {
                  required: true,
                  message: false
                },
                {
                  max: 10,
                  message: 'The last name must be less than 15 characters'
                }
              ]}
              style={{
                display: 'inline-block',
                width: 'calc(50% - 8px)',
                margin: '0 8px'
              }}
            >
              <Input placeholder='Input your last name' />
            </Form.Item>
            {/* </Form.Item> */}
            <Form.Item
              hasFeedback
              label='Email address'
              validateDebounce={200}
              // validateFirst
              name='email'
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Please input valid email!'
                },
                {}
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              hasFeedback
              validateDebounce={200}
              rules={[
                {
                  required: true,
                  message: 'Please input your password!'
                },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                  message:
                    'Minimum eight characters, at least one letter and one number'
                }
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* <Form.Item
              name='remember'
              valuePropName='checked'
              wrapperCol={{
                offset: 8,
                span: 16
              }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

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
                {t('signup')}
              </Button>
            </Form.Item>
          </Form>
          <div className='w-full flex  items-center gap-1'>
            <div className='border-t flex-1 '></div>
            <h1 className=''>Already a member?</h1>
            <h1
              className='cursor-pointer text-blue-500 hover:text-blue-400'
              onClick={() => navigate('/signin')}
            >
              Sign in
            </h1>
            <div className='border-t flex-1 '></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Signup
