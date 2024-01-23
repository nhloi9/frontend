import React, { useEffect, useState } from 'react'
import { Dropdown, Image as ImageAntd, Tooltip } from 'antd'
import { LuEyeOff } from 'react-icons/lu'
import { IoIosVideocam } from 'react-icons/io'
import { AiOutlineEye } from 'react-icons/ai'
import GoogleMapReact from 'google-map-react'
import { FaLocationDot } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import CardHeader from './CardHeader'
import { MdArrowOutward } from 'react-icons/md'

const CardBody = ({ post }) => {
  const navigate = useNavigate()
  const [readMore, setReadMore] = useState(false)
  function cutString (text, maxChars) {
    if (text.length <= maxChars) {
      return text // No need to cut, the string is already within the limit
    }

    // Find the last space within the first maxChars characters
    const lastSpaceIndex = text.lastIndexOf(' ', maxChars)

    if (lastSpaceIndex !== -1) {
      return text.substring(0, maxChars)
    } else {
      return text.substring(0, lastSpaceIndex)
    }
  }
  if (post?.text) {
    console.log(cutString(post.text, 20))
  }

  return (
    <div className=' card_body min-h-[100px]'>
      <div className='px-4  '>
        {post?.hashtags?.map(hashtag => (
          <span
            className='cursor-pointer italic text-blue-500 hover:underline pr-2'
            onClick={() => {
              navigate('/hashtags/' + hashtag.name?.slice(1))
            }}
          >
            {hashtag?.name}
          </span>
        ))}
        {post?.text && (
          <div>
            {cutString(post?.text, 200)?.length === post?.text?.length ? (
              <Linkify>{post.text}</Linkify>
            ) : (
              // <p>{post.text}</p>
              <div>
                {readMore ? (
                  <p>
                    <Linkify>{post.text}</Linkify>

                    <span
                      className='ml-2 text-red-400 cursor-pointer'
                      onClick={() => {
                        setReadMore(false)
                      }}
                    >
                      hidden
                    </span>
                  </p>
                ) : (
                  <p>
                    <Linkify>{cutString(post?.text, 200)}</Linkify>
                    <span
                      onClick={() => setReadMore(true)}
                      className='ml-1 text-red-400 cursor-pointer'
                    >
                      ...read more
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <ShowFileAndPlace post={post} />
      {post?.shareId && <SharedPost post={post?.share} />}
    </div>
  )
}

const AnyReactComponent = ({ text }) => (
  // <Tooltip title={'ldldlddddddddd'}>
  <div
    style={{
      position: 'absolute',
      transform: 'translate(-50%, -100%)'
    }}
  >
    <FaLocationDot size={38} color='red' className='' />
  </div> // </Tooltip>
)

const SingleImage = ({ image }) => {
  // const [width, setWidth] = useState(1)
  // const [height, setHeight] = useState(1)
  useEffect(() => {
    let img = new Image()
    img.src = image.url

    img.onload = () => {
      setRatio(img.height / img.width)
    }
  })
  const [ratio, setRatio] = useState(1)

  return (
    <div
      className={`w-full ${
        ratio > 1.2
          ? 'h-[700px] sm:h-[800px]'
          : ratio > 1
          ? 'h-[600px]'
          : 'h-[400px] sm:h-[500px]'
      }`}
    >
      <ImageAntd
        src={image.url}
        alt=''
        className={`!w-full !h-full shadow-md ${
          ratio > 1.2 ? 'object-contain' : 'object-cover'
        }`}
      />
    </div>
  )
}

const CustomImage = ({ image }) => (
  // <ImageAntd.PreviewGroup items={list}>
  <div className=' w-full h-full relative'>
    <ImageAntd
      preview={{
        destroyOnClose: true,
        // mask: <AiOutlineEye />
        mask: <div></div>
      }}
      src={image.thumbnail ?? image.url}
      alt=''
      height={'100%'}
      width={'100%'}
      className={` block w-full h-full object-cover`}
    />
    {image.thumbnail && (
      <IoIosVideocam
        className='!absolute !top-2 !left-2 z-0 !text-gray-700 '
        size={24}
      />
    )}
  </div>
  // </ImageAntd.PreviewGroup>
)

//detect link and display
const Linkify = ({ children }) => {
  const isUrl = word => {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm
    return word.match(urlPattern)
  }

  const addMarkup = word => {
    return isUrl(word)
      ? `<a tar href="${word}" target='_blank'>${word}</a>`
      : word
  }

  const words = children.split(' ')
  const formatedWords = words.map((w, i) => addMarkup(w))
  const html = formatedWords.join(' ')
  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className='leading-4'
      // className='!line-clamp-1'
    />
  )
}

const SharedPost = ({ post }) => {
  const [readMore, setReadMore] = useState(false)
  const navigate = useNavigate()
  return (
    <div className='mx-4 pb-3 rounded-md border-gray-400 border '>
      {post && (
        <div className='relative'>
          <div className='absolute top-2 right-2 z-10'>
            <Tooltip title='Go to post'>
              <div
                className='w-6 h-6 flex items-center cursor-pointer justify-center rounded-sm bg-gray-200 shadow'
                onClick={() => navigate('/post/' + post?.id)}
              >
                <MdArrowOutward className='!text-gray-900  !text-[25px] ' />
              </div>
            </Tooltip>
          </div>
          <CardHeader post={post} disableEdit={true} />
          <div className='px-4  '>
            {post?.text && (
              <div>
                {post.text?.length < 100 ? (
                  post.text
                ) : (
                  // <p>{post.text}</p>
                  <div>
                    {readMore ? (
                      <p>
                        {post.text}

                        <span
                          className='ml-2 text-red-400 cursor-pointer'
                          onClick={() => {
                            setReadMore(false)
                          }}
                        >
                          hidden
                        </span>
                      </p>
                    ) : (
                      <p>
                        {post.text?.slice(0, 100)}
                        <span
                          onClick={() => setReadMore(true)}
                          className='ml-1 text-red-400 cursor-pointer'
                        >
                          ...read more
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <ShowFileAndPlace post={post} />
        </div>
      )}
      {!post && (
        <div className='  px-3  h-[250px] flex gap-3'>
          <div className='w-[250px] h-full rounded-md bg-gray-200 flex items-center justify-center '>
            <LuEyeOff size={35} className='!text-gray-400' />
          </div>
          <div>
            <h1 className='!text-[20px]'>
              This item isn't available right now.
            </h1>
            <br />
            <p className='text-gray-500 text-sm'>
              Its privacy settings may have changed or it has expired.
            </p>
          </div>
        </div>
      )}
      <div className='flex justify-end pt-2 px-3'>
        {post?.shareBys && (
          <Dropdown
            menu={{
              items: post.shareBys?.map((post, index) => ({
                key: index,
                label: (
                  <Link to={'/profile/' + post?.user?.id}>
                    <div className='flex justify-between'>
                      {post.user?.firstname + ' ' + post.user?.lastname}{' '}
                      <span className=' text-gray-500'>
                        {' '}
                        {post?.createdAt && moment(post.createdAt).fromNow()}
                      </span>
                    </div>
                  </Link>
                )
              }))
            }}
          >
            <div className='flex flex-col items-center'>
              <p className='text-sm cursor-pointer hover:underline'>
                {post?.shareBys?.length ?? 0} shares
              </p>
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  )
}

const ShowFileAndPlace = ({ post }) => {
  return (
    <div>
      {post?.files?.length > 0 && (
        <div className='backdrop-contrast-[0.9]  mt-3 '>
          <ImageAntd.PreviewGroup
            preview={{
              toolbarRender: (a, { current }) => {
                if (post.files && post.files[current]?.thumbnail) return <></>
                else return a
              },
              destroyOnClose: true,

              imageRender: (a, { current }, c) => {
                if (post.files && post.files[current]?.thumbnail)
                  return (
                    // <div className='w-[80%] h-[80%]   bg-gray-900 p-1'>
                    <video
                      disablePictureInPicture
                      // muted
                      controls
                      src={post.files[current].url}
                      className='object-contain max-w-[80%] max-h-[80%] rounded-md'
                    />
                    // </div>
                  )
                else return a
              }
            }}
          >
            {/* <div className='dkkd'> */}
            {post.files?.length === 1 && (
              // <ImageAntd
              //   src={post.files[0]?.thumbnail ?? post.files[0]?.url}
              //   alt=''
              //   className={`object-contain`}
              //   height={'500px'}
              // />
              <div className='w-full h-[500px]'>
                <CustomImage image={post.files[0]} />
              </div>
            )}
            {post.files.length === 2 && (
              <div className='w-full h-[400px] bg-white sm:h-[600px] grid grid-cols-2 gap-[2px]  '>
                {post.files.map((file, index, files) => (
                  <div
                    className={`w-full h-full border border-gray-200  ${
                      index === 0 ? 'border-l-0' : 'border-r-0'
                    }`}
                  >
                    <CustomImage image={file} />
                  </div>
                ))}
              </div>
            )}

            {post.files.length === 3 && (
              <div className='w-full h-[400px] sm:h-[600px] grid grid-rows-2 grid-flow-col gap-[2px] bg-white '>
                <div className='row-span-2  border border-l-0 border-gray-200 '>
                  <CustomImage
                    // list={post.files.map(file => file.url)}
                    image={post.files[0]}
                  />
                </div>
                <div class='col-span-1  border  border-gray-200 border-r-0'>
                  <CustomImage image={post.files[1]} />
                </div>
                <div class='row-span-1 col-span-1 border border-gray-200 border-r-0  '>
                  <CustomImage
                    list={post.files.map(file => file.url)}
                    image={post.files[2]}
                  />
                </div>
              </div>
            )}

            {post.files.length === 4 && (
              <div className='w-full h-[400px] sm:h-[600px] flex flex-wrap gap-[2px]  bg-white'>
                {post.files.map((file, index, files) => (
                  <div
                    className={`border border-gray-200 w-[calc(50%-1px)] h-[calc(50%-1px)] ${
                      index % 2 === 0 ? 'border-l-0' : 'border-r-0'
                    } `}
                  >
                    <CustomImage key={index} image={file} />
                  </div>
                ))}
              </div>
            )}

            {post.files.length > 4 && (
              <div className='w-full h-[400px] sm:h-[600px] flex flex-wrap gap-[2px] bg-white '>
                {post.files.map((file, index, files) => (
                  <div
                    className={`w-[calc(50%-1px)]  h-[calc(50%-1px)] border border-gray-200 ${
                      index % 2 === 0 ? 'border-l-0' : 'border-r-0'
                    } ${index === 3 ? 'relative  ' : ''}  ${
                      index > 3 && 'hidden'
                    }`}
                  >
                    <CustomImage image={file} />
                    {index === 3 && (
                      <h1 className=' opacity-100 !drop-shadow-2xl -translate-x-[50%] -translate-y-[50%] absolute z-50 top-[50%] left-[50%] text-[22px]  font-[600]'>
                        + {post.files.length - 4}
                      </h1>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ImageAntd.PreviewGroup>
          {/* </div> */}
        </div>
      )}
      {post?.files?.length === 0 && post?.location && (
        <div className='h-[470px]  overflow-hidden relative'>
          <GoogleMapReact
            options={{
              fullscreenControl: false
              // styles: [
              //   {
              //     stylers: [
              //       { saturation: -100 },
              //       { gamma: 100 },
              //       { lightness: 10 },
              //       { visibility: '0' }
              //     ]
              //   }
              // ]
            }}
            bootstrapURLKeys={{
              key: 'AIzaSyBZ1nIrsxL6R_NX1ATzKO8iLsWlU9C2aSA'
            }}
            defaultCenter={post?.location}
            defaultZoom={
              post?.location?.type === 'Country'
                ? 2
                : post?.location?.type === 'Street'
                ? 15
                : post?.location?.type === 'Point Address' ||
                  post?.location?.type === 'POI'
                ? 18
                : 7
            }
            // zoom={defaultZoom}
            yesIWantToUseGoogleMapApiInternals
            draggable={true}
            // draggable={true}

            // onChildMouseDown={}
            // onChildClick={(a, b, c) => {
            //   console.log({ a, b, c })
            // }}
          >
            <AnyReactComponent
              lat={post?.location?.lat}
              lng={post?.location?.lng}
              text='My Marker'
            />
          </GoogleMapReact>
        </div>
      )}
    </div>
  )
}

export default CardBody
