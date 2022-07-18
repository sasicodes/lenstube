import React, { useRef } from 'react'
import { useInView } from 'react-cool-inview'

const ShortVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const onClickVideo = () => {
    if (videoRef.current?.paused) return videoRef.current?.play()
    videoRef.current?.pause()
  }

  const { observe } = useInView({
    threshold: 1,
    onLeave: () => {
      videoRef.current?.pause()
    },
    onEnter: () => {
      videoRef.current?.play()
    }
  })

  return (
    <div ref={observe} className="flex justify-center mt-5 snap-center">
      <video
        onClick={() => onClickVideo()}
        ref={videoRef}
        className="rounded-xl h-[calc(100vh-10rem)]"
        loop={true}
      >
        <source
          src="https://livepeercdn.com/asset/fc38vt0y0fhnc516/video"
          type="video/mp4"
        />
      </video>
      <div ref={observe} />
    </div>
  )
}

export default ShortVideo
