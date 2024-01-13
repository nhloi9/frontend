import React from 'react'
import EmojiPicker from 'emoji-picker-react'
import { Popover } from 'antd'
import { BsEmojiSmile } from 'react-icons/bs'

const EmojiSelect = ({ textRef, ...props }) => {
  // const [openPicker, setOpenPicker] = useState(false)
  // const dropdownRef = useRef(null)
  // const handleClickOutside = e => {
  //   if (dropdownRef.current && !dropdownRef.current?.contains(e.target)) {
  //     setOpenPicker(false)
  //   }
  // }
  // useEffect(() => {
  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => document.removeEventListener('mousedown', handleClickOutside)
  // }, [])

  return (
    // <h1
    //   ref={dropdownRef}
    //   className='cursor-pointer relative h-[20px] '
    //   onClick={e => {
    //     e.stopPropagation()
    //     setOpenPicker(!openPicker)
    //     textRef.current.focus()
    //   }}
    // >
    //   😀
    //   {openPicker && (
    //     <div
    //       className={`absolute z-[5000]  ${
    //         // right ? ' right-6' : bottom ? 'bottom-2' : 'left-2'
    //         css
    //       }  z-[1000] bg-black w-[300px] h-[400px]`}
    //       onClick={e => {
    //         e.stopPropagation()
    //       }}
    //       onMouseOver={() => {
    //         textRef.current.focus()
    //       }}
    //     >
    //       {/* <EmojiPicker
    //         className={'!text-[10px]'}
    //         width='300px'
    //         height='400px'
    //         lazyLoadEmojis={true}
    //         autoFocusSearch={false}
    //         onEmojiClick={e => {
    //           const currentValue = textRef.current.value
    //           const start = textRef.current.selectionStart
    //           const end = textRef.current.selectionEnd
    //           textRef.current.value =
    //             currentValue?.slice(0, start) +
    //             e.emoji +
    //             currentValue?.slice(end)
    //           textRef.current.focus()

    //           textRef.current.setSelectionRange(
    //             start + e.emoji.length,
    //             start + e.emoji.length
    //           )
    //         }}
    //       /> */}
    //     </div>
    //   )}
    //   {/* <div className='clear-both'></div> */}
    // </h1>
    <Popover
      {...props}
      // destroyTooltipOnHide
      placement='bottomLeft'
      content={
        <div className=' overflow-auto'>
          <EmojiPicker
            className={'w-[200px] h-[250px]'}
            width={'250px'}
            height={'350px'}
            lazyLoadEmojis={true}
            autoFocusSearch={false}
            onEmojiClick={e => {
              const currentValue = textRef.current.value
              const start = textRef.current.selectionStart
              const end = textRef.current.selectionEnd
              textRef.current.value =
                currentValue?.slice(0, start) +
                e.emoji +
                currentValue?.slice(end)
              textRef.current.focus()

              textRef.current.setSelectionRange(
                start + e.emoji.length,
                start + e.emoji.length
              )
            }}
          />
        </div>
      }
      title=''
      trigger='click'
    >
      <span
        className='w-min h-min'
        onClick={e => {
          e.stopPropagation()
          // setOpenPicker(!openPicker)
          textRef.current.focus()
        }}
      >
        <BsEmojiSmile size={18} className='text-gray-500 cursor-pointer' />
      </span>
    </Popover>
  )
}

export default EmojiSelect
