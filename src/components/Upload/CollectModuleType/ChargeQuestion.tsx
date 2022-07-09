import clsx from 'clsx'
import React, { FC } from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import { CollectModuleType, UploadedVideo } from 'src/types/local'

type Props = {
  uploadedVideo: UploadedVideo
  // eslint-disable-next-line no-unused-vars
  setCollectType: (data: CollectModuleType) => void
}

const ChargeQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Would you like to charge user?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              type: 'freeCollectModule',
              isFree: true,
              referralFee: 0
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-3 text-sm border border-gray-200 hover:border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              'border-indigo-500':
                uploadedVideo.collectModule.type === 'freeCollectModule' &&
                uploadedVideo.collectModule.isFree
            }
          )}
        >
          <span>No, its Free</span>
          {uploadedVideo.collectModule.type === 'freeCollectModule' &&
            uploadedVideo.collectModule.isFree && <AiOutlineCheck />}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              type: 'feeCollectModule',
              isFree: false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-3 text-sm border border-gray-200 hover:border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              'border-indigo-500':
                uploadedVideo.collectModule.type === 'feeCollectModule' &&
                !uploadedVideo.collectModule.isFree
            }
          )}
        >
          <span>Yes, Some Amount</span>
          {uploadedVideo.collectModule.type === 'feeCollectModule' &&
            !uploadedVideo.collectModule.isFree && <AiOutlineCheck />}
        </button>
      </div>
    </div>
  )
}

export default ChargeQuestion