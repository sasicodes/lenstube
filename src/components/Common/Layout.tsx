import { useQuery } from '@apollo/client'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { AUTH_ROUTES, POLYGON_CHAIN_ID } from '@utils/constants'
import { getToastOptions } from '@utils/functions/getToastOptions'
import { CURRENT_USER_QUERY } from '@utils/gql/queries'
import useIsMounted from '@utils/hooks/useIsMounted'
import { AUTH } from '@utils/url-path'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import React, { FC, ReactNode, Suspense, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Profile } from 'src/types'
import { useAccount, useDisconnect, useNetwork } from 'wagmi'

import FullPageLoader from './FullPageLoader'
const Header = dynamic(() => import('./Header'), {
  suspense: true
})
const Sidebar = dynamic(() => import('./Sidebar'), {
  suspense: true
})

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const { pathname, replace, asPath } = useRouter()
  const { setChannels, setUserSigNonce } = useAppStore()
  const {
    setSelectedChannel,
    selectedChannel,
    setIsAuthenticated,
    isAuthenticated
  } = usePersistStore()
  const { resolvedTheme } = useTheme()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { mounted } = useIsMounted()
  const { address, connector, isDisconnected } = useAccount()
  const isSignInPage = pathname === AUTH

  const { loading } = useQuery(CURRENT_USER_QUERY, {
    variables: { ownedBy: address },
    skip: !isAuthenticated,
    onCompleted(data) {
      const channels: Profile[] = data?.profiles?.items
      if (channels.length === 0) {
        setSelectedChannel(null)
      } else {
        setChannels(channels)
        setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce)
        if (!selectedChannel) setSelectedChannel(channels[0])
      }
    }
  })

  useEffect(() => {
    // Allow only user is authenticated
    if (!isAuthenticated && AUTH_ROUTES.includes(pathname)) {
      replace(`${AUTH}?next=${asPath}`)
    }
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    const logout = () => {
      setIsAuthenticated(false)
      setSelectedChannel(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('lenstube.store')
      if (disconnect) disconnect()
    }

    if (
      refreshToken &&
      accessToken &&
      accessToken !== 'undefined' &&
      refreshToken !== 'undefined' &&
      selectedChannel &&
      chain?.id === POLYGON_CHAIN_ID
    ) {
      setIsAuthenticated(true)
    } else {
      if (isAuthenticated) logout()
    }
    if (isDisconnected && mounted) {
      if (disconnect) disconnect()
      setIsAuthenticated(false)
    }
    // connector?.on('change', () => {
    // logout()
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    disconnect,
    connector,
    isDisconnected,
    setSelectedChannel
  ])

  if (loading || !mounted) return <FullPageLoader />

  return (
    <>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#000000' : '#ffffff'}
        />
      </Head>
      <Toaster
        position="bottom-right"
        toastOptions={getToastOptions(resolvedTheme)}
      />
      <Suspense fallback={<FullPageLoader />}>
        <div className="flex pb-14 md:pb-0">
          <Sidebar />
          <div className="w-full md:pl-[94px] pl-2 pr-2 md:pr-4 max-w-[110rem] mx-auto">
            {!isSignInPage && <Header />}
            <div className="py-2">{children}</div>
          </div>
        </div>
      </Suspense>
    </>
  )
}

export default Layout
