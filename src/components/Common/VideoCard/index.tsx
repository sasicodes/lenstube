import { STATIC_ASSETS } from '@utils/constants'
import { getIsSensitiveContent } from '@utils/functions/getIsSensitiveContent'
import getProfilePicture from '@utils/functions/getProfilePicture'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import imageCdn from '@utils/functions/imageCdn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC, useState } from 'react'
import { LenstubePublication } from 'src/types/local'

import ShareModal from './ShareModal'
import ThumbnailOverlays from './ThumbnailOverlays'
import VideoOptions from './VideoOptions'

dayjs.extend(relativeTime)

type Props = {
  video: LenstubePublication
}

const VideoCard: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)
  const isSensitiveContent = getIsSensitiveContent(
    video.metadata?.attributes,
    video.id
  )

  return (
    <div className="bg-gray-50 rounded-xl dark:bg-[#181818] group">
      {video.hidden ? (
        <div className="grid h-full place-items-center">
          <span className="text-xs">Video Hidden by User</span>
        </div>
      ) : (
        <>
          <ShareModal
            video={video}
            show={showShare}
            setShowShare={setShowShare}
          />
          <Link href={`/watch/${video.id}`}>
            <a>
              <div className="relative rounded-t-xl aspect-w-16 aspect-h-9">
                <img
                  src={imageCdn(
                    isSensitiveContent
                      ? `${STATIC_ASSETS}/images/sensor-blur.png`
                      : getThumbnailUrl(video),
                    'thumbnail'
                  )}
                  draggable={false}
                  className="object-cover object-center w-full h-full rounded-t-xl lg:w-full lg:h-full"
                  alt="thumbnail"
                />
                <ThumbnailOverlays video={video} />
              </div>
            </a>
          </Link>
          <div className="p-2">
            <div className="flex items-start space-x-2.5">
              <Link href={`/watch/${video.id}`}>
                <a className="flex-none mt-0.5">
                  <img
                    className="w-8 h-8 rounded-xl"
                    src={getProfilePicture(video.profile)}
                    alt="channel picture"
                    draggable={false}
                  />
                </a>
              </Link>
              <div className="flex flex-col items-start flex-1 pb-1">
                <div className="flex w-full items-start justify-between space-x-1.5">
                  <Link href={`/watch/${video.id}`}>
                    <a className="text-[15px] font-medium line-clamp-2">
                      {video.metadata?.name}
                    </a>
                  </Link>
                  <VideoOptions video={video} setShowShare={setShowShare} />
                </div>
                <Link href={`/${video.profile?.handle}`}>
                  <a className="text-xs hover:opacity-100 opacity-70">
                    {video.profile?.handle}
                  </a>
                </Link>
                <div className="flex overflow-hidden items-center space-x-1 text-[11px] opacity-70">
                  <span className="whitespace-nowrap">
                    {video.stats?.totalUpvotes} likes
                  </span>
                  <span className="middot" />
                  {video.createdAt && (
                    <span className="whitespace-nowrap">
                      {dayjs(new Date(video.createdAt)).fromNow()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoCard
