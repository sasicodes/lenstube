import { useLazyQuery } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { Tab } from '@headlessui/react'
import { LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID } from '@utils/constants'
import { SEARCH_CHANNELS_QUERY, SEARCH_VIDEOS_QUERY } from '@utils/gql/queries'
import useDebounce from '@utils/hooks/useDebounce'
import useOutsideClick from '@utils/hooks/useOutsideClick'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { FC, useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

const Videos = dynamic(() => import('./Videos'))
const Channels = dynamic(() => import('./Channels'))

interface Props {
  onSearchResults?: () => void
}

const GlobalSearchBar: FC<Props> = ({ onSearchResults }) => {
  const [activeSearch, setActiveSearch] = useState('PUBLICATION')
  const [keyword, setKeyword] = useState('')
  const debouncedValue = useDebounce<string>(keyword, 500)
  const resultsRef = useRef(null)
  useOutsideClick(resultsRef, () => setKeyword(''))

  const [searchChannels, { data: channels, loading }] = useLazyQuery(
    activeSearch === 'PROFILE' ? SEARCH_CHANNELS_QUERY : SEARCH_VIDEOS_QUERY
  )

  useEffect(() => {
    if (keyword.trim().length)
      searchChannels({
        variables: {
          request: {
            type: activeSearch,
            query: keyword,
            limit: 10,
            sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
          }
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, activeSearch])

  const clearSearch = () => {
    setKeyword('')
    onSearchResults?.()
  }

  return (
    <div className="lg:w-96 md:w-80">
      <div ref={resultsRef}>
        <div className="relative mt-1">
          <div className="relative w-full overflow-hidden border border-gray-200 cursor-default dark:border-gray-800 rounded-xl sm:text-sm">
            <input
              className="w-full py-2 pl-3 pr-10 text-sm bg-transparent focus:outline-none"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by hashtag / channel"
              value={keyword}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <AiOutlineSearch
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            className={clsx(
              'md:absolute w-full mt-1 text-base bg-white overflow-hidden dark:bg-[#181818] rounded-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
              { hidden: debouncedValue.length === 0 }
            )}
          >
            <Tab.Group>
              <Tab.List className="flex justify-center">
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'px-4 py-2 border-b-2 text-sm focus:outline-none w-full',
                      selected
                        ? 'border-indigo-500 opacity-100'
                        : 'border-transparent opacity-50 hover:bg-indigo-500/[0.12]'
                    )
                  }
                  onClick={() => {
                    setActiveSearch('PUBLICATION')
                  }}
                >
                  Videos
                </Tab>
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'px-4 py-2 border-b-2 text-sm focus:outline-none w-full',
                      selected
                        ? 'border-indigo-500 opacity-100'
                        : 'border-transparent opacity-50 hover:bg-indigo-500/[0.12]'
                    )
                  }
                  onClick={() => {
                    setActiveSearch('PROFILE')
                  }}
                >
                  Channels
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel className="overflow-y-auto max-h-[80vh] no-scrollbar focus:outline-none">
                  <Videos
                    results={channels?.search?.items}
                    loading={loading}
                    clearSearch={clearSearch}
                  />
                </Tab.Panel>
                <Tab.Panel className="overflow-y-auto max-h-[80vh] no-scrollbar focus:outline-none">
                  <Channels
                    results={channels?.search?.items}
                    loading={loading}
                    clearSearch={clearSearch}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            {loading && (
              <div className="flex justify-center p-5">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default GlobalSearchBar
