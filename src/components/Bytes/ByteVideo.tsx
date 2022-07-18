import { getVideoUrl } from '@utils/functions/getVideoUrl'
import React, { FC, useRef } from 'react'
import { useInView } from 'react-cool-inview'
import { LenstubePublication } from 'src/types/local'

type Props = {
  video: LenstubePublication
}

const ByteVideo: FC<Props> = ({ video }) => {
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
      videoRef.current?.load()
      videoRef.current?.play()
    }
  })

  return (
    <div ref={observe} className="flex justify-center mt-5 snap-center">
      <video
        onClick={() => onClickVideo()}
        ref={videoRef}
        className="rounded-xl bg-black h-[calc(100vh-10rem)] md:w-[439px]"
        loop={true}
      >
        <source src={getVideoUrl(video)} type="video/mp4" />
      </video>
      <div ref={observe} />
    </div>
  )
}

export default ByteVideo
