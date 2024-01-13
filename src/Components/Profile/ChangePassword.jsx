import React, { useEffect, useRef, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  AutoComplete,
  Checkbox,
  Select,
  Space,
  DatePicker,
  Button
} from 'antd'

import SelectReact from 'react-select'
// import PhoneInput from 'react-phone-number-input'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { Country, State, City } from 'country-state-city'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileAction } from '../../Reduxs/Actions/authAction'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { putApi } from '../../network/api'
import toast from 'react-hot-toast'
import { authTypes } from '../../Reduxs/Types/authType'

const countryOptions = Country.getAllCountries().map(item => ({
  value: item.isoCode,
  label: item.name
}))

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 16
    }
  }
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
}

const ChangePassword = ({ open, onCancel, set }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const [form] = Form.useForm()
  const [selectedCountry, setSelectedCountry] = useState(
    user.detail?.country
      ? {
          value: user.detail.country,
          label: Country.getCountryByCode(user.detail.country).name
        }
      : null
  )
  const [birthday, setBirthday] = useState(user.birthday)

  const [selectedState, setSelectedState] = useState(
    user.detail?.state && user.detail?.country
      ? {
          value: user.detail?.state,
          label: State.getStateByCodeAndCountry(
            user.detail.state,
            user.detail.country
          ).name
        }
      : null
  )

  const [stateOptions, setStateOptions] = useState([])

  const { firstname, lastname, email, password } = user
  const { country, state, intro, website, phone, gender } = user.detail ?? {}

  useEffect(() => {
    if (selectedCountry) {
      setStateOptions(
        State.getStatesOfCountry(selectedCountry.value).map(item => ({
          value: item.isoCode,
          label: item.name
        }))
      )
    }
  }, [selectedCountry])

  return (
    <Modal
      open={open}
      title={set ? 'Set password' : 'Change password'}
      okText='Update'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            const { oldPassword, newPassword } = values
            putApi(set ? '/users/password/set' : '/users/password', {
              oldPassword: set ? undefined : oldPassword,
              newPassword
            })
              .then(() => {
                toast.success(
                  set ? 'Set password successfully' : 'Changed password'
                )
                set &&
                  dispatch({
                    type: authTypes.SET_PASSWORD_SUCCESS
                  })
                onCancel()
              })
              .catch(err => toast.error(err))
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout='vertical'
        name='form_in_modal'
        initialValues={{
          modifier: 'public'
        }}
      >
        {!set && (
          <Form.Item
            name='oldPassword'
            label='Old Password'
            rules={[
              {
                required: true,
                message: 'Please input your old password!'
              }
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name='newPassword'
          label={set ? 'Password' : 'New Password'}
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
                  new Error('The new password that you entered do not match!')
                )
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
      {!set && (
        <div>
          You forget your password?{' '}
          <Button
            type='link'
            size='small'
            onClick={() => {
              navigate('/forget-password')
            }}
          >
            <span className=' !text-sm '> forget password</span>
          </Button>
        </div>
      )}
      <hr />
    </Modal>
  )
}

export default ChangePassword
