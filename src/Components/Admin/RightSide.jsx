import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteApi, getApi, postApi } from '../../network/api'
import CardHeader from '../PostCard/CardHeader'
import CardBody from '../PostCard/CardBody'
import { Button, Spin } from 'antd'
import { useDispatch } from 'react-redux'
import { globalTypes } from '../../Reduxs/Types/globalType'
import Box from '@mui/material/Box'
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons
} from '@mui/x-data-grid'
import { darken, lighten, styled } from '@mui/material/styles'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { MdDelete } from 'react-icons/md'
import { LuEye } from 'react-icons/lu'
import toast from 'react-hot-toast'
import { baseUrl } from '../../Constants'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true
      // text: 'Chart.js Line Chart'
    }
  }
}

const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7)

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6)

const getSelectedBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5)

const getSelectedHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4)

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--Open': {
    backgroundColor: getBackgroundColor(
      theme.palette.info.main,
      theme.palette.mode
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode
      )
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.info.main,
          theme.palette.mode
        )
      }
    }
  },
  '& .super-app-theme--1': {
    backgroundColor: getBackgroundColor(
      theme.palette.success.main,
      theme.palette.mode
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode
      )
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.success.main,
          theme.palette.mode
        )
      }
    }
  },
  '& .super-app-theme--2': {
    backgroundColor: getBackgroundColor(
      theme.palette.warning.main,
      theme.palette.mode
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode
      )
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.warning.main,
          theme.palette.mode
        )
      }
    }
  },
  '& .super-app-theme--0': {
    backgroundColor: getBackgroundColor(
      theme.palette.error.main,
      theme.palette.mode
    ),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode
      )
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode
        )
      }
    }
  }
}))

const RightSide = () => {
  const { type } = useParams()
  return (
    <>
      {type === 'report' && <Report />}

      {type === 'home' && <Home />}
      {type === 'user' && <Users />}
    </>
  )
}

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 90
  },
  {
    field: 'firstname',
    headerName: 'First name',
    width: 150,
    headerClassName: 'super-app-theme--header'
    // editable: true
  },
  {
    headerClassName: 'super-app-theme--header',
    field: 'lastname',
    headerName: 'Last name',
    width: 150
    // editable: true
  },
  {
    headerClassName: 'super-app-theme--header',
    field: 'email',
    headerName: 'Email address',

    width: 250,
    editable: false
  },

  {
    headerClassName: 'super-app-theme--header',
    field: 'createdAt',
    headerName: 'Date Created',
    type: 'date',
    width: 140,
    editable: false
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id }) => {
      return [
        <GridActionsCellItem
          icon={<LuEye />}
          label='Delete'
          onClick={() => window.open(baseUrl + '/profile/' + id, '_blank')}
          color='inherit'
        />,
        <GridActionsCellItem
          icon={<MdDelete />}
          label='Delete'
          // onClick={handleDeleteClick(id)}
          color='inherit'
        />
      ]
    }
  }
]

const Users = () => {
  const dispatch = useDispatch()
  const [load, setLoad] = useState(true)

  const [usersData, setUsersData] = useState([])
  const rows = usersData.map(item => {
    const { id, lastname, firstname, createdAt, email } = item
    return { id, lastname, firstname, email, createdAt: new Date(createdAt) }
  })

  useEffect(() => {
    getApi('/admins/all-users')
      .then(({ data: { users } }) => {
        setLoad(false)
        setUsersData(users)
      })
      .catch(error => {
        setLoad(false)
        toast.error(error)
      })
  }, [dispatch])

  return (
    <div className='w-full h-[calc(100vh-60px)] p-5'>
      <Box
      // sx={{ height: 400, width: '100%' }}
      >
        <StyledDataGrid
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main'
            }
            // '& .super-app-theme--header': {
            //   backgroundColor: 'rgba(255, 7, 0, 0.55)'
            // }
          }}
          className='!bg-white'
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10
              }
            }
          }}
          pageSizeOptions={[5]}
          // checkboxSelection
          disableRowSelectionOnClick
          getRowClassName={params => `super-app-theme--${params.row.id % 3}`}
        />
      </Box>
      {load && (
        <div className='w-min mx-auto mt-[100px]'>
          <Spin />
        </div>
      )}
    </div>
  )
}

const Home = () => {
  const dispatch = useDispatch()
  const [load, setLoad] = useState(true)

  const [statisticsData, setStatisticsData] = useState(null)

  const labels = statisticsData?.map(
    item => months[Number(item.month) - 1] + '/' + item.year
  )

  const data = statisticsData && {
    labels,
    datasets: [
      {
        label: 'Users',
        data: labels.map((item, index) => statisticsData[index]?.numberOfUsers),
        borderColor: 'rgb(190, 24 ,93)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        label: 'Online Users',
        data: labels.map(
          (item, index) => statisticsData[index]?.numberOfOnlineUsers
        ),
        borderColor: 'rgb(29, 78 ,216)',
        backgroundColor: 'rgba(96, 165, 250)'
      }
    ]
  }
  const data2 = statisticsData && {
    labels,
    datasets: [
      {
        label: 'Posts',
        data: labels.map((item, index) => statisticsData[index]?.numberOfPosts),
        borderColor: 'rgb(22 ,163, 74 )',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  useEffect(() => {
    getApi('/statistics')
      .then(({ data: { statistics } }) => {
        setStatisticsData(statistics?.reverse())
        setLoad(false)
      })
      .catch(error => {
        toast.error(error)
        setLoad(false)
      })
  }, [dispatch])
  return (
    <div className='w-[calc(100%-35px)]'>
      {load && (
        <div className='w-min mx-auto mt-[100px]'>
          <Spin />
        </div>
      )}
      {statisticsData && (
        <div className=''>
          <Line options={options} data={data} />
          <Line options={options} data={data2} />
        </div>
      )}
    </div>
  )
}

const Report = () => {
  const [load, setLoad] = useState(true)
  const dispatch = useDispatch()

  const [reportedPosts, setRepostedPosts] = useState([])
  const keepPost = async post => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: true
        }
      })
      await postApi('/posts/' + post?.id + '/keep')
      setRepostedPosts(pre => pre.filter(item => item.id !== post.id))

      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: false
        }
      })
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          error
        }
      })
    }
  }

  const removePost = async post => {
    try {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: true
        }
      })
      await deleteApi('/posts/' + post?.id)
      setRepostedPosts(pre => pre.filter(item => item.id !== post.id))

      dispatch({
        type: globalTypes.ALERT,
        payload: {
          loading: false
        }
      })
    } catch (error) {
      dispatch({
        type: globalTypes.ALERT,
        payload: {
          error
        }
      })
    }
  }

  useEffect(() => {
    getApi('/posts/report')
      .then(({ data: { posts } }) => {
        setRepostedPosts(posts)
        setLoad(false)
      })
      .catch(err => {
        setLoad(false)
        toast.error(err)
      })
  }, [])
  return (
    <div className='w-[calc(100%-35px)]'>
      <div className='bg-white shadow-md p-4'>
        <h1 className='text-[20px]'>User-reported content </h1>
      </div>
      <div className='w-[70%] mx-auto my-5 '>
        {load && (
          <div className='w-min mx-auto mt-[100px]'>
            <Spin />
          </div>
        )}
        {reportedPosts?.map(post => (
          <ReportPost post={post} keepPost={keepPost} removePost={removePost} />
        ))}
      </div>
    </div>
  )
}

const ReportPost = ({ post, keepPost, removePost }) => {
  const navigate = useNavigate()
  return (
    <div className='bg-white rounded-md border mb-3 border-gray-300'>
      <div className='px-4'>
        <div className='py-3 '>
          {post?.reports?.length < 3 ? (
            post?.reports?.map((report, index) => {
              return (
                <span>
                  {index > 0 && ', '}
                  <span
                    className=' cursor-pointer hover:underline !font-[500]'
                    onClick={() => navigate('/profile/' + report?.user?.id)}
                  >
                    {report?.user?.firstname + ' ' + report?.user?.lastname}
                  </span>
                </span>
              )
            })
          ) : (
            <span>
              <span
                className='cursor-pointer hover:underline font-[500]'
                onClick={() =>
                  navigate('/profile/' + post?.reports[0]?.user?.id)
                }
              >
                {post?.reports[0]?.user?.firstname +
                  ' ' +
                  post?.reports[0]?.user?.lastname}
              </span>{' '}
              <span> and {post?.reports?.length - 1} others</span>
            </span>
          )}{' '}
          reported this post for{' '}
          <span className='lowercase'>
            {getReportNames(post?.reports)
              ?.slice(0, 2)
              .map((reportName, index) =>
                index === 0 ? reportName : ', ' + reportName
              )}
          </span>
          {getReportNames(post?.reports)?.length > 2 && (
            <span> and other reasons</span>
          )}
        </div>
        <hr className='bg-gray-300 h-[1px] ' />
      </div>
      <CardHeader post={post} disableEdit={true} />
      <CardBody post={post} />
      <div className='px-4'>
        <hr className='bg-gray-300 h-[1px] my-5' />
        <div className='grid grid-cols-2 gap-4 pb-4'>
          <Button type='primary' onClick={() => keepPost(post)}>
            Keep
          </Button>
          <Button
            type='default'
            className='!bg-gray-300'
            onClick={() => removePost(post)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

const reportTitles = [
  {
    value: 'violence',
    title: 'Violence'
  },
  {
    value: 'spam',
    title: 'Spam'
  },
  {
    value: 'harassment',
    title: 'Harassment'
  },
  {
    value: 'hate',
    title: 'Hate speech'
  },
  {
    value: 'nudity',
    title: 'Nudity'
  },
  {
    value: 'false',
    title: 'False information'
  },
  {
    value: 'terrorism',
    title: 'Terrorism'
  }
]

const getReportNames = reports => {
  const arr = []
  for (const report of reports) {
    if (arr.length > 3) break
    const reportData = reportTitles.find(item => item.value === report.type)
    if (!arr.includes(reportData?.title)) {
      arr.push(reportData.title)
    }
  }
  console.log({ arr })
  return arr
}

export default RightSide
