import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import usePersistStore from '@lib/store/persist'
import { LENSTUBE_APP_ID } from '@utils/constants'
import { PROFILE_FEED_QUERY } from '@utils/gql/queries'
import { COMMENTED_LIBRARY } from '@utils/url-path'
import Link from 'next/link'
import React, { useState } from 'react'
import { AiOutlineComment } from 'react-icons/ai'
import { BiChevronRight } from 'react-icons/bi'
import { LenstubePublication } from 'src/types/local'

import CommentedVideoCard from '../CommentedVideoCard'

const Commented = () => {
  const [commented, setCommented] = useState<LenstubePublication[]>([])
  const { isAuthenticated, selectedChannel } = usePersistStore()

  const { loading, data } = useQuery(PROFILE_FEED_QUERY, {
    variables: {
      request: {
        publicationTypes: 'COMMENT',
        profileId: selectedChannel?.id,
        limit: 4,
        sources: [LENSTUBE_APP_ID]
      }
    },
    skip: !selectedChannel?.id,
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setCommented(data?.publications?.items)
    }
  })

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="inline-flex items-center space-x-2 text-lg font-semibold">
          <AiOutlineComment />
          <span>Commented</span>
        </h1>
        <Link href={COMMENTED_LIBRARY}>
          <a className="flex items-center space-x-0.5 text-xs text-indigo-500">
            <span>See all</span> <BiChevronRight />
          </a>
        </Link>
      </div>
      {!isAuthenticated && (
        <NoDataFound text="Sign In to view videos that you commented on." />
      )}
      {loading && <TimelineShimmer />}
      {!data?.publications?.items.length && !loading && isAuthenticated && (
        <NoDataFound text="This list has no videos." />
      )}
      <div className="grid gap-x-4 lg:grid-cols-4 gap-y-1.5 md:gap-y-6 2xl:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
        {commented?.map((video: LenstubePublication, idx: number) => (
          <CommentedVideoCard key={idx} video={video} />
        ))}
      </div>
    </div>
  )
}

export default Commented
