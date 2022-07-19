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
    <div className="block">
      <div className="items-center justify-end hidden h-full py-5 space-y-4 md:flex md:flex-col">
        <VideoOptions
          video={video}
          setShowShare={setShowShare}
          showOnHover={false}
        />
        <PublicationReaction
          publication={video}
          size="xl"
          isVertical
          showLabel={false}
        />
        <Button
          variant="secondary"
          className="!p-0"
          onClick={() => setShowShare(true)}
        >
          <span className="flex items-center space-x-1">
            <AiOutlineShareAlt className="text-xl" />
          </span>
        </Button>
      </div>
      <ShareModal video={video} show={showShare} setShowShare={setShowShare} />
    </div>
  )
}

export default ByteActions
