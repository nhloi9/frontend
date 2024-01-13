import React, { useEffect, useState } from 'react'
import Header from '../Components/Layout/Header'
import { Button, Form, Input, Modal } from 'antd'
import ReactCodeInput from 'react-code-input'
import { FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

import { postApi } from '../network/api'
import { useDispatch } from 'react-redux'
import { authTypes } from '../Reduxs/Types/authType'
import { globalTypes } from '../Reduxs/Types/globalType'
import { useNavigate } from 'react-router-dom'

const ForgetPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [code, setCode] = useState(null)
  const [email, setEmail] = useState({
    value: ''
  })
  const dispatch = useDispatch()

  const validateEmail = email => {
    if (
      email &&
      new RegExp('[a-zA-Z0-9]+.[a-zA-Z0-9]+@gmail.com').test(email)
    ) {
      return {
        validateStatus: 'success',
        errorMsg: null
      }
    }
    return {
      validateStatus: 'error',
      errorMsg: 'please input invalid email!'
    }
  }
  const onEmailChange = ({ target: { value } }) => {
    setEmail({
      ...validateEmail(value),
      value
    })
  }

  const submitEmail = () => {
    validateEmail(email)
    if (email.value) {
      postApi('/users/forget-password', { email: email.value })
        .then(() => {
          setStep(2)
        })
        .catch(err => {
          setEmail({
            ...email,
            validateStatus: 'error',
            errorMsg: err
          })
        })
    } else {
      setEmail({
        validateStatus: 'error',
        errorMsg: 'please input your email!'
      })
    }
  }

  return (
    <div className=' flex h-screen  bg-gray-50 justify-center items-center'>
      <div className=' w-[400px]  h-min min-h-[200px] bg-slate-100 px-4 py-3'>
        {step === 1 && (
          <>
            <h1 className='text-[22px] !font-[1000]'>
              Don't know your password?
            </h1>
            <br />
            <Form layout='vertical' name='basic'>
              <Form.Item
                label='Enter your email address'
                validateStatus={email.validateStatus}
                help={email.errorMsg || ''}
              >
                <Input value={email.value} onChange={onEmailChange} />
              </Form.Item>
              <Form.Item>
                <Button
                  className='!w-full'
                  type='primary'
                  htmlType='submit'
                  disabled={email.errorMsg}
                  onClick={submitEmail}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
        {step === 2 && (
          <VerifyCode setStep={setStep} email={email.value} setCode={setCode} />
        )}
        {step === 3 && (
          <Form
            layout='vertical'
            name='form_in_modal'
            initialValues={{}}
            onFinish={values => {
              postApi('/users/reset-password', {
                newPassword: values.newPassword,
                email: email.value,
                code
              })
                .then(({ data: { user, socketToken } }) => {
                  dispatch({
                    type: authTypes.LOGOUT_SUCCESS
                  })
                  dispatch({
                    type: authTypes.ALL,
                    payload: { user, socketToken }
                  })
                  dispatch({
                    type: globalTypes.ALERT,
                    payload: {
                      loading: false,
                      success: 'Welcome back!' + user?.firstname
                    }
                  })
                  navigate('/')
                })
                .catch(err => {
                  toast.error(err)
                })
            }}
          >
            <Form.Item
              name='newPassword'
              label='Enter Your Password'
              rules={[
                {
                  required: true,
                  message: 'Please input your new password!'
                },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                  message:
                    'Minimum eight characters, at least one letter and one number'
                }
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name='confirm'
              label='Confirm Password'
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!'
                },
                ({ getFieldValue }) => ({
                  validator (_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error(
                        'The new password that you entered do not match!'
                      )
                    )
                  }
                })
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
      {/* <Header /> */}
      {/*  */}
    </div>
  )
}

const VerifyCode = ({ setStep, email, setCode }) => {
  const [time, setTime] = useState(30)
  const [form] = Form.useForm()
  useEffect(() => {
    window.timeout = setTimeout(() => {
      if (time > 0) {
        setTime(time => time - 1)
      } else {
        clearTimeout(window.timeout)
      }
    }, 1000)
    return () => {
      window.timeout && clearTimeout(window.timeout)
    }
  }, [time])

  return (
    <>
      <div className='flex gap-3'>
        <FaArrowLeft
          size={18}
          className='cursor-pointer'
          onClick={() => {
            setStep(1)
          }}
        />
        <h1>A code has been sent to your email</h1>
      </div>
      <br />
      <Form
        form={form}
        layout='vertical'
        name='basic'
        initialValues={{
          remember: true
        }}
        onFinish={values => {
          postApi('/users/verify-reset-password', { email, code: values.code })
            .then(() => {
              setStep(3)
              setCode(values.code)
            })
            .catch(err => {
              form.setFields([
                {
                  name: 'code',
                  errors: [err]
                }
              ])
            })
        }}
        // onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          label={`Enter your code(${time}  s)`}
          name='code'
          rules={[
            {
              required: true,
              len: 6,
              message: 'Please enter your full code'
            }
          ]}
        >
          <ReactCodeInput
            disabled={time === 0}
            type='text'
            fields={6}
            className=''
          />
        </Form.Item>

        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            disabled={time === 0}
            className='!w-full'
          >
            Submit
          </Button>
        </Form.Item>
        {time === 0 && (
          <div>
            You have not received the code yet?
            <Button
              type='link'
              size='small'
              onClick={() => {
                postApi('/users/forget-password', { email })
                  .then(() => {
                    window.timeout && clearTimeout(window.timeout)
                    setTime(30)
                    form.setFields([
                      {
                        name: 'code',
                        value: null,
                        errors: ['']
                      }
                    ])
                  })
                  .catch(err => {
                    // console.log(err)
                    toast.error(err)
                  })
              }}
            >
              resend code
            </Button>
          </div>
        )}
      </Form>
    </>
  )
}

export default ForgetPasswordPage
