import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import ShortVideo from './ShortVideo'

const Bytes = () => {
  return (
    <div className="overflow-y-hidden">
      <MetaTags />
      <div className="h-[calc(100vh-5rem)] overflow-y-scroll no-scrollbar snap-y snap-mandatory">
        <ShortVideo />
        <ShortVideo />
        <ShortVideo />
        <ShortVideo />
        <ShortVideo />
      </div>
    </div>
  )
}

export default Bytes
