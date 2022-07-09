import { useQuery } from '@apollo/client'
import MetaTags from '@components/Common/MetaTags'
import SettingsShimmer from '@components/Shimmers/SettingsShimmer'
import usePersistStore from '@lib/store/persist'
import { PROFILE_QUERY } from '@utils/gql/queries'
import {
  SETTINGS,
  SETTINGS_DANGER_ZONE,
  SETTINGS_MEMBERSHIP,
  SETTINGS_PERMISSIONS
} from '@utils/url-path'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'
import Custom500 from 'src/pages/500'
import { MediaSet, Profile } from 'src/types'

const BasicInfo = dynamic(() => import('./BasicInfo'))
const Permissions = dynamic(() => import('./Permissions'))
const Membership = dynamic(() => import('./Membership'))
const SideNav = dynamic(() => import('./SideNav'))
const DangerZone = dynamic(() => import('./DangerZone'))

const Settings = () => {
  const { selectedChannel } = usePersistStore()
  const router = useRouter()

  const { data, loading, error } = useQuery(PROFILE_QUERY, {
    variables: {
      request: { handles: selectedChannel?.handle }
    },
    skip: !selectedChannel?.handle
  })

  if (error) return <Custom500 />
  if (
    data?.profiles?.items?.length === 0 ||
    (!selectedChannel && router.isReady)
  )
    return <Custom404 />
  const channel: Profile & {
    coverPicture: MediaSet
  } = data?.profiles?.items[0]

  return (
    <>
      <MetaTags title="Channel Settings" />
      {loading && <SettingsShimmer />}
      {!loading && !error && channel ? (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <SideNav channel={channel} />
          </div>
          <div className="md:col-span-3">
            {router.pathname === SETTINGS && <BasicInfo channel={channel} />}
            {router.pathname === SETTINGS_MEMBERSHIP && (
              <Membership channel={channel} />
            )}
            {router.pathname === SETTINGS_PERMISSIONS && <Permissions />}
            {router.pathname === SETTINGS_DANGER_ZONE && <DangerZone />}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Settings
