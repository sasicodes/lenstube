import { LENSTUBE_TWITTER_HANDLE, STATIC_ASSETS } from '@utils/constants'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

type Props = {
  title?: string
  description?: string
  image?: string
}

const MetaTags: FC<Props> = (props) => {
  const { description, title, image } = props
  const router = useRouter()

  const meta = {
    title: title ?? 'Lenstube',
    description:
      description ??
      'Lenstube is a decentralized video-sharing social media platform built with Lens protocol.',
    image: image ?? `${STATIC_ASSETS}/images/seo/og.png`,
    type: 'website'
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5"
      />
      <link rel="canonical" href={`https://lenstube.xyz${router.asPath}`} />
      <meta
        property="og:url"
        content={`https://lenstube.xyz${router.asPath}`}
      />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="Lenstube" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta name="twitter:card" content="summary" />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta name="twitter:site" content="Lenstube" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta property="twitter:image:src" content={meta.image} />
      <meta property="twitter:creator" content={LENSTUBE_TWITTER_HANDLE} />
      <link rel="preconnect" href="https://ik.imagekit.io" />
      <link rel="dns-prefetch" href="https://ik.imagekit.io" />
      <link rel="preconnect" href="https://assets.lenstube.xyz" />
      <link rel="dns-prefetch" href="https://assets.lenstube.xyz" />
      <link rel="preconnect" href="https://ipfs.infura.io" />
      <link rel="dns-prefetch" href="https://ipfs.infura.io" />
    </Head>
  )
}

export default MetaTags
