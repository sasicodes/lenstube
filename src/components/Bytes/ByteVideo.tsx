import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { getVideoUrl } from '@utils/functions/getVideoUrl'
import imageCdn from '@utils/functions/imageCdn'
import React, { FC, useRef } from 'react'
import { useInView } from 'react-cool-inview'
import { LenstubePublication } from 'src/types/local'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'

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
      <div className="relative">
        <video
          onContextMenu={(event) => event.preventDefault()}
          onClick={() => onClickVideo()}
          ref={videoRef}
          width="345"
          poster={imageCdn(getThumbnailUrl(video), 'thumbnail_v')}
          className="rounded-xl min-w-[250px] bg-black h-[calc(100vh-9rem)]"
          loop={true}
        >
          <source src={getVideoUrl(video)} type="video/mp4" />
        </video>
        <BottomOverlay video={video} />
        <div ref={observe} />
      </div>
      <ByteActions video={video} />
    </div>
  )
}

export default ByteVideo
