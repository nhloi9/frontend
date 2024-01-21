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
import { Country, State } from 'country-state-city'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileAction } from '../../Reduxs/Actions/authAction'
import dayjs from 'dayjs'

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

const EditProfile = ({ open, onCancel, setOpenResetPassword }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [form] = Form.useForm()
  const [selectedCountry, setSelectedCountry] = useState(
    user.detail?.country
      ? {
          value: 'VN',
          label: 'Việt Nam'
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
    } else setStateOptions([])
  }, [selectedCountry])

  return (
    <Modal
      open={open}
      title='Information'
      okText='Update'
      cancelText='Cancel'
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            console.log(values)
            const { email, password, agreement, ...data } = values

            dispatch(
              updateProfileAction({
                ...data,
                country: selectedCountry ? selectedCountry.value : '',
                state: selectedState ? selectedState.value : '',
                birthday
              })
            )
            form.setFieldValue('agreement', false)
          })

          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        {...formItemLayout}
        form={form}
        name='register'
        initialValues={{
          firstname,
          lastname,
          email,
          password: password ?? '',
          country: country ?? '',
          state: state ?? '',
          intro: intro ?? '',
          website: website ?? '',
          phone: phone ?? '',
          gender: gender ?? ''
        }}
        className='max-w-[600px] max-h-[70vh] overflow-y-hidden hover:overflow-y-scroll scroll-min'
        // style={{
        //   maxWidth: 600,
        //   maxHeight: '70vh',
        //   overflowY: 'scroll'
        // }}
        scrollToFirstError
      >
        <Form.Item name='email' label='E-mail'>
          <Input disabled={true} />
        </Form.Item>
        <Form.Item name='password' label='Password'>
          <Input.Password
            disabled={true}
            placeholder={user.password === null ? '' : '****************'}
          />
          <Button
            type='link'
            size='small'
            onClick={() => {
              onCancel()
              setOpenResetPassword(true)
            }}
          >
            <span className=' !text-sm '>
              {user.password === null ? 'set password' : 'change password'}
            </span>
          </Button>
        </Form.Item>
        <Form.Item
          name='firstname'
          label='First Name'
          // tooltip='What do you want others to call you?'
          rules={[
            {
              required: true,
              message: 'Please input your first name',
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='lastname'
          label='Last Name'
          // tooltip='What do you want others to call you?'
          rules={[
            {
              required: true,
              message: 'Please input your last name',
              whitespace: true
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label='Birth day'>
          <DatePicker
            // defaultValue={new Date()}
            defaultValue={
              user?.detail?.birthday
                ? new dayjs(new Date(user.detail.birthday))
                : null
            }
            format={'DD/MM/YYYY'}
            onChange={(date, dateString) => {
              if (date) {
                const curent = new dayjs(dateString, 'DD/MM/YYYY')

                setBirthday(curent.toISOString())
              } else setBirthday(null)
            }}
          />
        </Form.Item>
        <Form.Item name='phone' label='Phone Number' rules={[{}]}>
          <PhoneInput
            defaultCountry={'vn'}
            // value={phone}
            // onChange={phone => setPhone(phone)}
          />
        </Form.Item>
        \
        <Form.Item label='Address'>
          <Form.Item
            style={{
              display: 'inline-block',
              width: 'calc(50% - 8px)'
            }}
          >
            <SelectReact
              isClearable
              placeholder='Country'
              value={selectedCountry}
              onChange={data => {
                setSelectedCountry(data)
                setSelectedState(null)
              }}
              options={countryOptions}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              width: 'calc(50% - 8px)',
              margin: '0 8px'
            }}
          >
            <SelectReact
              isClearable
              placeholder='city'
              value={selectedState}
              onChange={data => {
                console.log(data)
                setSelectedState(data)
              }}
              options={stateOptions}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item
          name='website'
          label='Website'
          rules={[
            {
              type: 'string'
            },
            {
              max: 30
            }
          ]}
        >
          {/* <AutoComplete
            options={websiteOptions}
            onChange={onWebsiteChange}
            placeholder='website'
          > */}
          <Input />
          {/* </AutoComplete> */}
        </Form.Item>
        <Form.Item
          name='intro'
          label='Intro'
          rules={[
            {
              max: 100
            }
          ]}
        >
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>
        <Form.Item
          name='agreement'
          valuePropName='checked'
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Should accept agreement'))
            }
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>I have carefully confirmed the information</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditProfile
