import ShareModal from '@components/Common/VideoCard/ShareModal'
import VideoOptions from '@components/Common/VideoCard/VideoOptions'
import { Button } from '@components/UIElements/Button'
import PublicationReaction from '@components/Watch/PublicationReaction'
import React, { FC, useState } from 'react'
import { AiOutlineShareAlt } from 'react-icons/ai'
import { LenstubePublication } from 'src/types/local'

type Props = {
  video: LenstubePublication
}
const ByteActions: FC<Props> = ({ video }) => {
  const [showShare, setShowShare] = useState(false)

  return (
    <div className="flex flex-col justify-between w-12">
      <div className="items-center hidden py-2 space-y-4 md:flex md:flex-col">
        <VideoOptions
          video={video}
          setShowShare={setShowShare}
          showOnHover={false}
        />
      </div>
      <div className="items-center hidden py-3 space-y-3 md:flex md:flex-col">
        <PublicationReaction
          publication={video}
          iconSize="2xl"
          textSize="xs"
          isVertical={true}
          showLabel={true}
        />
        <Button
          variant="secondary"
          className="!p-0"
          onClick={() => setShowShare(true)}
        >
          <span className="flex flex-col items-center justify-center space-x-1">
            <AiOutlineShareAlt className="text-2xl" />
            <span className="pt-1 text-xs">Share</span>
          </span>
        </Button>
        <ShareModal
          video={video}
          show={showShare}
          setShowShare={setShowShare}
        />
      </div>
    </div>
  )
}

export default ByteActions
