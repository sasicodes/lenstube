import { LENSTER_WEBSITE_URL, STATIC_ASSETS } from '@utils/constants'
import { getKeyFromAttributes } from '@utils/functions/getFromAttributes'
import React, { FC } from 'react'
import { HiOutlineGlobe } from 'react-icons/hi'
import { RiTwitterLine } from 'react-icons/ri'
import { Profile } from 'src/types'

type Props = {
  channel: Profile
}

const About: FC<Props> = ({ channel }) => {
  const attributes = channel?.attributes
  if (!attributes?.length) return null

  return (
    <div className="space-y-4 md:pr-4 md:space-y-6">
      {channel?.bio && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-80">
            Description
          </h6>
          <p>{channel?.bio}</p>
        </div>
      )}
      <div className="flex flex-col space-y-3">
        <h6 className="text-xs font-semibold uppercase opacity-80">Links</h6>
        <div className="space-y-1.5">
          {getKeyFromAttributes(attributes, 'website') && (
            <div className="flex items-center space-x-1">
              <HiOutlineGlobe />
              <a
                href={getKeyFromAttributes(attributes, 'website')}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Website
              </a>
            </div>
          )}
          {getKeyFromAttributes(attributes, 'twitter') && (
            <div className="flex items-center space-x-1">
              <RiTwitterLine />
              <a
                href={`https://twitter.com/${getKeyFromAttributes(
                  attributes,
                  'twitter'
                )}`}
                target="_blank"
                rel="noreferer noreferrer"
                className="hover:text-indigo-500"
              >
                Twitter
              </a>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <span className="pr-0.5 grayscale" role="img">
              <img
                src={`${STATIC_ASSETS}/images/lenster-logo.svg`}
                alt=""
                className="w-3.5 h-3.5"
                draggable={false}
              />
            </span>
            <a
              href={`${LENSTER_WEBSITE_URL}/u/${channel?.handle}`}
              target="_blank"
              rel="noreferer noreferrer"
              className="hover:text-indigo-500"
            >
              Lenster
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
