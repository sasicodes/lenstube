import getProfilePicture from '@utils/functions/getProfilePicture'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import React, { FC } from 'react'
import { NewMirrorNotification, Notification, Profile } from 'src/types'

dayjs.extend(relativeTime)

interface Props {
  notification: NewMirrorNotification & Notification & { profile: Profile }
}

const MirroredNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        <Link href={`/${notification?.profile?.handle}`}>
          <a className="inline-flex items-center space-x-1.5 font-base">
            <img
              className="w-4 h-4 rounded"
              src={getProfilePicture(notification.profile)}
              alt="channel picture"
              draggable={false}
            />
            <div>{notification?.profile?.handle}</div>
          </a>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 truncate dark:text-gray-400">
          mirrored your video
        </span>
        <div className="flex items-center flex-none space-x-1 text-xs text-gray-400">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </>
  )
}

export default MirroredNotification
