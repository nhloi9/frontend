import React, { useEffect, useState } from 'react'
import Header from '../Components/Layout/Header'
import LeftSide from '../Components/Home/LeftSide'
import RightSide from '../Components/Home/RightSide'
import Status from '../Components/Home/Status'
import Posts from '../Components/Home/Posts'
import { useDispatch, useSelector } from 'react-redux'
import Stories from '../Components/Home/Stories'
import { postApi } from '../network/api'
import { postTypes } from '../Reduxs/Types/postType'
import { getHomeStoriesAction } from '../Reduxs/Actions/storyAction'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Spin } from 'antd'

const HomePage = () => {
  const [more, setMore] = useState(true)
  const { posts } = useSelector(state => state.post)
  const dispatch = useDispatch()

  useEffect(() => {
    postApi('/posts/home')
      .then(({ data: { posts: arr } }) => {
        dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: arr })
        if (arr?.length < 3) setMore(false)
      })
      .catch(err => {
        setMore(false)
      })
    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [dispatch])

  useEffect(() => {
    dispatch(getHomeStoriesAction())
  }, [dispatch])

  const loadFunc = () => {
    if (more)
      postApi('/posts/home', {
        oldPostIds: posts?.map(item => item.id)
      })
        .then(({ data: { posts: arr } }) => {
          if (arr.length < 5) setMore(false)
          dispatch({
            type: postTypes.GET_HOME_POST_SUCCESS,
            payload: [...posts, ...arr]
          })
          if (arr?.length < 5) setMore(false)
        })
        .catch(err => {
          setMore(false)
        })
  }

  return (
    <div>
      <Header />

      <div className=' flex justify-center bg-gray-100 mt-[50px]'>
        <div className='hidden fixed h-screen xl:block left-0 w-[25%] max-w-[300px]'>
          <LeftSide />
        </div>
        <div className='w-full  max-w-[600px] rounded-xl min-h-[105vh]   '>
          <Stories />
          {/* <div className='w-[80%] mx-auto'> */}
          <Status />
          <br />

          <div
            className=''
            //  ref={scrollRef}
          >
            <InfiniteScroll
              scrollThreshold={'10px'}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              dataLength={posts.length}
              next={loadFunc}
              hasMore={true}
              loader={
                more && (
                  <div className='flex justify-center items-center h-[60px] pointer-events-none '>
                    <Spin />
                    {/* <Lottie width={50} height={50} options={{ animationData }}></Lottie> */}
                  </div>
                )
              }
            >
              <Posts posts={posts} />
            </InfiniteScroll>
            {/* )} */}
          </div>
          {/* <InfiniteScroll
            dataLength={posts?.length} //This is important field to render the next data
            // next={fetchData}
            hasMore={true}
            loader={
              <div className='w-min mx-auto mt-[100px]'>
                <Spin />
              </div>
            }
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            // below props only if you need pull down functionality
            // refreshFunction={this.refresh}
            // pullDownToRefresh
            // pullDownToRefreshThreshold={50}
            // pullDownToRefreshContent={
            //   <h3 style={{ textAlign: 'center' }}>
            //     &#8595; Pull down to refresh
            //   </h3>
            // }
            releaseToRefreshContent={
              <h3 style={{ textAlign: 'center' }}>
                &#8593; Release to refresh
              </h3>
            }
          >
            <Posts posts={posts} />
          </InfiniteScroll> */}
          {/* <Posts posts={posts} /> */}
          {/* <CardSection></CardSection> */}
          {/* <Main></Main> */}
          {/* </div> */}
          <br />
        </div>
        <div className='hidden fixed h-screen xl:block right-0 w-[25%] max-w-[300px]'>
          <RightSide />
        </div>
      </div>
    </div>
  )
}

export default HomePage
