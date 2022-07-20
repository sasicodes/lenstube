import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { getVideoUrl } from '@utils/functions/getVideoUrl'
import imageCdn from '@utils/functions/imageCdn'
import React, { FC, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { LenstubePublication } from 'src/types/local'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'

type Props = {
  video: LenstubePublication
}

const ByteVideo: FC<Props> = ({ video }) => {
  const [playing, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const onClickVideo = () => {
    if (videoRef.current?.paused) {
      videoRef.current?.play()
      setIsPlaying(true)
    } else {
      videoRef.current?.pause()
      setIsPlaying(false)
    }
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
    <div ref={observe} className="flex justify-center md:mt-5 snap-center">
      <div className="relative group">
        <video
          onContextMenu={(event) => event.preventDefault()}
          onClick={() => onClickVideo()}
          ref={videoRef}
          disableRemotePlayback
          width="345"
          poster={imageCdn(getThumbnailUrl(video), 'thumbnail_v')}
          className="md:rounded-xl min-w-[250px] w-[345px] 2xl:w-[450px] h-[78vh] bg-black md:h-[calc(100vh-9em)]"
          loop={true}
        >
          <source src={getVideoUrl(video)} type="video/mp4" />
        </video>
        <div className="absolute top-0 px-3 pt-5 pb-3 hidden group-hover:block">
          {!playing ? (
            <BsPlayFill className="h-6 w-6 text-white" />
          ) : (
            <BsPauseFill className="h-6 w-6 text-white" />
          )}
        </div>
        <BottomOverlay video={video} />
        <div ref={observe} />
      </div>
      <ByteActions video={video} />
    </div>
  )
}

export default ByteVideo
