import { Avatar } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { MdCallEnd } from 'react-icons/md'
import { PiPhoneCallBold } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import Peer from 'peerjs'
import { BsPinAngle, BsPinAngleFill } from 'react-icons/bs'

import {
  getImageOfConversation,
  getNameOfConversation
} from '../../utils/conversation'
import { defaulAvatar } from '../../Constants'
import { socket } from '../../socket'
import toast from 'react-hot-toast'
import { callTypes } from '../../Reduxs/Types/callType'
import { IoMic } from 'react-icons/io5'
import { IoIosMicOff } from 'react-icons/io'
import { FaVideo, FaVideoSlash } from 'react-icons/fa6'

const CallModal = () => {
  const [changeData, setChangeData] = useState({})
  const [active, setActive] = useState(null)
  const callData = useSelector(state => state.call)
  const [audio, setAudio] = useState(true)
  const [video, setVideo] = useState(callData?.type === 'video' ?? false)
  const { user } = useSelector(state => state.auth)
  const callsRef = useRef([])

  const [peers, setPeers] = useState([])
  const dispatch = useDispatch()
  const [forceRender, setForceRender] = useState(false)

  const myVideoTag = useRef()
  const myPeer = useRef()

  const [answere, setAnswere] = useState(false)

  const timerRef = useRef(null)

  const handleAnswere = () => {
    createStream()
  }

  const handleEndCall = () => {
    console.log('end call')
    handleCloseMedia()
    // socket.emit('endCall', callData)
    socket.emit('leftCall', callData?.conversation?.id)
    dispatch({ type: callTypes.CALL, payload: null })
    // peers.forEach(peer)
  }

  useEffect(() => {
    if (answere) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [answere])

  function createStream () {
    getMedia({ video: true, audio: true })
      .then(stream => {
        window.stream = stream
        if (myVideoTag?.current) {
          const video = myVideoTag.current
          video.srcObject = stream
          video.onloadedmetadata = function (e) {
            video.play()
          }
        }

        socket.emit('joinRoom', callData?.conversation?.id)
        socket.on('allUsers', ids => {
          setAnswere(true)
          console.log({ peer: myPeer.current })
          console.log({ ids })
          const peers = []
          ids.forEach(id => {
            console.log('loop')
            console.log({ id, peer: myPeer.current })
            const call = myPeer.current?.call(id, stream)
            callsRef.current.push(call)
            call?.on('stream', function (remoteStream) {
              console.log({ id: call.peer })
              console.log({ remoteStream: remoteStream.getTracks() })

              if (!peers.find(item => item.peerId === call.peer)) {
                console.log(34)
                peers.push({
                  peerId: call.peer,
                  remoteStream
                })
              }
              setPeers(peers)
              console.log({ peers })
            })
          })
        })
      })
      .catch(err => {
        toast.error(
          "You need to give the app permission to access the device's audio or camera"
        )
      })

    console.log({ peers })
  }

  async function getMedia (constraints) {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    return stream
  }

  // get mediastream if is author
  useEffect(() => {
    if (callData?.author === true) {
      // getMedia({
      //   audio: true,
      //   video: callData?.type === 'video' ?? false
      // })
      //   .then(stream => {
      // window.stream = stream
      if (myVideoTag?.current) {
        const video = myVideoTag.current
        video.srcObject = window.stream
        video.onloadedmetadata = function (e) {
          video.play()
        }
      }
      // })
      // .catch(err => {
      //   toast.error(
      //     "You need to give the app permission to access the device's audio or camera"
      //   )
      // })
    }
  }, [callData?.author, callData?.type])

  //create peer object
  useEffect(() => {
    const peer = new Peer(socket.socket.id, {
      host: 'peerserver-7j9x.onrender.com',
      // host: 'localhost',
      port: 443,
      path: '/myapp',
      secure: true,
      config: {
        iceServers: [
          {
            urls: 'stun:stun.relay.metered.ca:80'
          },
          {
            urls: 'turn:standard.relay.metered.ca:80',
            username: '21b7fc8d9951109a5c397a43',
            credential: 'R86yh/ayGSI5+CEU'
          },
          {
            urls: 'turn:standard.relay.metered.ca:80?transport=tcp',
            username: '21b7fc8d9951109a5c397a43',
            credential: 'R86yh/ayGSI5+CEU'
          },
          {
            urls: 'turn:standard.relay.metered.ca:443',
            username: '21b7fc8d9951109a5c397a43',
            credential: 'R86yh/ayGSI5+CEU'
          },
          {
            urls: 'turns:standard.relay.metered.ca:443?transport=tcp',
            username: '21b7fc8d9951109a5c397a43',
            credential: 'R86yh/ayGSI5+CEU'
          }
        ]
      }
    })

    peer.on('call', function (call) {
      callsRef.current.push(call)
      console.log('receive call')

      call.answer(myVideoTag.current?.srcObject) // Answer the call with an A/V stream.

      call.on('stream', function (remoteStream) {
        setPeers(peers => {
          if (!peers.find(item => item.peerId === call.peer)) {
            return [...peers, { peerId: call.peer, remoteStream }]
          } else return peers
        })
        setForceRender(pre => !pre)
      })
    })
    myPeer.current = peer

    peer.on('open', id => {
      console.log({ id })
    })
    console.log(peer)
    return () => {
      peer?.destroy()
    }
  }, [])

  useEffect(() => {
    setForceRender(pre => !pre)
  }, [peers?.length])
  console.log({ peers })

  // enable it
  useEffect(() => {
    const rerenderInterval = setInterval(() => {
      setForceRender(Math.random())
    }, 1000)
    return () => {
      clearInterval(rerenderInterval)
    }
  }, [])

  useEffect(() => {
    if (peers?.length > 0) {
      setAnswere(true)
    }
  }, [peers?.length])

  useEffect(() => {
    socket.on('leftCall', (roomId, socketId) => {
      console.log({ roomId, socketId })
      try {
        if (roomId === callData.conversation?.id) {
          setPeers(pre => pre?.filter(item => item.peerId !== socketId))
        }
      } catch (error) {}
    })
    return () => socket.off('leftCall')
  }, [])

  const handleOffMic = (roomId, socketId) => {
    setAudio(false)
    if (myVideoTag.current?.srcObject?.getAudioTracks()[0])
      myVideoTag.current.srcObject.getAudioTracks()[0].enabled = false
    socket.emit('change', {
      audio: false,
      video
    })
    // getMedia({ audio: false, video }).then(stream => {
    //   setAudio(false)
    //   if (myVideoTag?.current) {
    //     const video = myVideoTag.current
    //     video.srcObject = stream
    //     video.onloadedmetadata = function (e) {
    //       video.play()
    //     }
    //   }
    // })
  }

  const handleOnMic = () => {
    setAudio(true)
    if (myVideoTag.current?.srcObject?.getAudioTracks()[0])
      myVideoTag.current.srcObject.getAudioTracks()[0].enabled = true
    socket.emit('change', {
      audio: true,
      video
    })
  }
  const handleOffCammera = (roomId, socketId) => {
    setVideo(false)
    if (myVideoTag.current?.srcObject?.getVideoTracks()[0])
      myVideoTag.current.srcObject.getVideoTracks()[0].enabled = false
    socket.emit('change', {
      video: false,
      audio
    })
  }

  const handleOnCammera = (roomId, socketId) => {
    setVideo(true)
    if (myVideoTag.current?.srcObject?.getVideoTracks()[0])
      myVideoTag.current.srcObject.getVideoTracks()[0].enabled = true
    socket.emit('change', {
      video: true,
      audio
    })
    // getMedia({ audio, video: true }).then(stream => {
    //   setVideo(true)
    //   if (myVideoTag?.current) {
    //     const video = myVideoTag.current
    //     video.srcObject = stream
    //     video.onloadedmetadata = function (e) {
    //       video.play()
    //     }
    //   }
    //   callsRef.current.forEach(call =>
    //     call.peerConnection.getSenders().forEach((sender, index) => {
    //       // console.log(sender.track.kind, index)
    //       console.log({ sender })
    //       if (sender?.track?.kind === 'video' || sender.track === null) {
    //         sender.replaceTrack(stream.getVideoTracks[0])
    //       }
    //       // console.log(sender?.track?.kind, index)
    //     })
    //   )
    // })
  }

  useEffect(() => {
    socket.emit('getChange')
    socket.on('getChange', change => setChangeData(change))
    return () => socket.emit('leave')
  }, [])

  console.log({ changeData })

  const handleCloseMedia = () => {
    // if (myVideoTag.current) {
    //   console.log({ video: myVideoTag.current })
    // myVideoTag.current.srcObject?.getTracks().forEach(track => {
    //   console.log({ track })
    //   track?.stop()
    // })
    // }
    if (window.stream) {
      window.stream?.getTracks()?.forEach(track => {
        track?.stop()
        // console.log({ track })
      })
      window.stream = undefined
    }
  }

  useEffect(() => {
    return () => {
      handleCloseMedia()
    }
  }, [])

  return (
    <div className=' fixed top-0 bottom-0 left-0 right-0 z-[99] bg-[#00000069] flex justify-center items-center text-gray-200'>
      {!answere && (
        <audio
          hidden
          controls
          autoPlay
          loop
          src={require('../../assets/audio/muzee.mp3')}
        ></audio>
      )}
      <div className=' bg-black relative w-[90vw] rounded-lg h-[95vh]   shadow-[0_0_5px_gray] flex flex-col items-center justify-between'>
        <div className=' flex flex-col items-center'>
          {!answere && (
            <>
              <div className=' pt-5 pb-2'>
                {getImageOfConversation(callData?.conversation, user?.id)
                  .length === 1 ? (
                  <Avatar
                    size={80}
                    src={
                      getImageOfConversation(
                        callData?.conversation,
                        user?.id
                      )[0] ?? defaulAvatar
                    }
                  />
                ) : (
                  <div className='w-[80px] h-[80px] relative'>
                    <img
                      alt=''
                      className='w-[50px] h-[50px] border-white block  rounded-full !absolute bottom-0 left-0 !z-20 !shadow-lg border'
                      src={
                        getImageOfConversation(
                          callData?.conversation,
                          user?.id
                        )[0] ?? defaulAvatar
                      }
                    ></img>
                    <Avatar
                      size={50}
                      className='!absolute top-0 right-0'
                      src={
                        getImageOfConversation(
                          callData?.conversation,
                          user?.id
                        )[1] ?? defaulAvatar
                      }
                    />
                  </div>
                )}
              </div>
              <h1 className=' text-[22px] font-[600] text-gray-100'>
                {getNameOfConversation(callData?.conversation, user?.id)}
              </h1>

              <br />
              <span className='text-gray-200 text-sm'>Calling...</span>
            </>
          )}
        </div>

        <div className=' flex flex-col items-center pb-4'>
          {answere && <Timer />}
          <br />
          <div className='flex gap-6'>
            {callData?.author !== true && !answere && (
              <div
                className=' rounded-full  bg-green-500 w-11 h-11 flex items-center justify-center cursor-pointer'
                onClick={handleAnswere}
              >
                <PiPhoneCallBold size={30} color='green' />
              </div>
            )}
            <div
              className=' rounded-full  bg-gray-300 w-11 h-11 flex items-center justify-center cursor-pointer'
              onClick={handleEndCall}
            >
              <MdCallEnd size={30} color='red' />
            </div>
          </div>
        </div>
        {
          <div
            className={`absolute top-0 left-0 w-full h-[[70vh] gap-2 flex flex-wrap p-3 ${
              peers?.find(item => item.peerId === active)
                ? 'flex-col h-full w-[50vh] '
                : ''
            }`}
          >
            {peers.map(peer => (
              <VideoCard
                peer={peer}
                key={peer?.peerId}
                change={changeData[peer.peerId]}
                active={active}
                setActive={setActive}
              />
            ))}
          </div>
        }
        {
          <div className='absolute  rounded-md bottom-4 right-4 w-[300px] h-[200px] '>
            <div className='w-full h-full relative'>
              <video
                muted={true}
                ref={myVideoTag}
                className=' rounded-md w-full h-full object-cover'
                autoPlay={true}
              ></video>
              {video === false && (
                <div className='w-full h-full rounded-md absolute top-0 left-0 bg-black'></div>
              )}
              <div className='absolute bottom-1 right-2 w-min flex gap-2'>
                {audio ? (
                  <IoMic className='cursor-pointer' onClick={handleOffMic} />
                ) : (
                  <IoIosMicOff
                    className='cursor-pointer'
                    onClick={handleOnMic}
                  />
                )}
                {video ? (
                  <FaVideo
                    className='cursor-pointer'
                    onClick={handleOffCammera}
                  />
                ) : (
                  <FaVideoSlash
                    className='cursor-pointer'
                    onClick={handleOnCammera}
                  />
                )}
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

const Timer = () => {
  const [minute, setMinute] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [time, setTime] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    if (time) {
      setMinute(Math.floor(time / 60))
      setSeconds(time % 60)
    }
  }, [time])
  return (
    <div className='text-white  text-[12px]'>
      {minute < 10 ? '0' + minute : minute}:
      {seconds < 10 ? '0' + seconds : seconds}
    </div>
  )
}

const VideoCard = ({ peer, change, active, setActive }) => {
  const [audio, setAudio] = useState(false)
  const [video, setVideo] = useState(false)
  const callData = useSelector(state => state.call)
  const [userData, setUserData] = useState(null)
  useEffect(() => {
    if (peer?.peerId) {
      socket.emit('getUserFromPeerId', peer.peerId)
    }
  }, [peer?.peerId])

  useEffect(() => {
    const receiveUserId = ({ userId, peerId }) => {
      if (peerId === peer.peerId) {
        setUserData(
          callData?.conversation?.members?.find(
            item => item?.user?.id?.toString() === userId
          )?.user
        )
      }
    }
    socket.on('getUserFromPeerId', receiveUserId)
    return () => socket.off('getUserFromPeerId', receiveUserId)
  }, [peer?.peerId])
  console.log({ peer })
  const videoRef = useRef()
  const [stream, setStream] = useState()
  useEffect(() => {
    if (videoRef?.current) {
      console.log({ a: peer.remoteStream })
      const video = videoRef.current
      video.srcObject = peer?.remoteStream
      video.onloadedmetadata = function (e) {
        video.play()
      }
    }
  }, [])

  return (
    <div
      className={`block rounded-md bg-gray-600 border-blue-600 border-[1px]  ${
        peer?.peerId === active
          ? 'fixed bottom-0 left-0 top-0   right-0'
          : 'w-[300px] h-[200px]'
      }`}
    >
      <div className='w-full h-full relative'>
        <video
          muted={change?.audio === false ?? false}
          autoPlay={true}
          ref={videoRef}
          className=' object-cover w-full h-full rounded-md'
        ></video>
        {change?.video === false && (
          <div className='w-full h-full rounded-md absolute top-0 left-0 bg-gray-500'></div>
        )}
        {userData && (
          <div className='absolute bottom-1 left-2'>
            {userData?.firstname ?? ''}
          </div>
        )}
        {peer?.peerId === active ? (
          <BsPinAngleFill
            className='absolute top-3 right-3 cursor-pointer '
            onClick={() => {
              setActive(null)
            }}
          />
        ) : (
          <BsPinAngle
            className='absolute top-1 right-2 cursor-pointer '
            onClick={() => {
              setActive(peer?.peerId)
            }}
          />
        )}

        <div className='absolute bottom-1 right-2 w-min flex gap-2'>
          {!(change?.audio === false) ? <IoMic /> : <IoIosMicOff />}
          {!(change?.video === false) ? <FaVideo /> : <FaVideoSlash />}
        </div>
      </div>
    </div>
  )
}

export default CallModal
