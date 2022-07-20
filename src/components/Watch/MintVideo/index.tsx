import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { useMutation } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
} from '@utils/constants'
import omitKey from '@utils/functions/omitKey'
import {
  BROADCAST_MUTATION,
  CREATE_COLLECT_TYPED_DATA
} from '@utils/gql/queries'
import usePendingTxn from '@utils/hooks/usePendingTxn'
import { utils } from 'ethers'
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { SiOpenmined } from 'react-icons/si'
import {
  CreateCollectBroadcastItemResult,
  FreeCollectModuleSettings
} from 'src/types'
import { LenstubePublication } from 'src/types/local'
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi'

import MintModal from './MintModal'

type Props = {
  video: LenstubePublication
  variant?: 'primary' | 'secondary'
}

const MintVideo: FC<Props> = ({ video, variant = 'primary' }) => {
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  const [showMintModal, setShowMintModal] = useState(false)
  const { isAuthenticated } = usePersistStore()
  const { userSigNonce, setUserSigNonce } = useAppStore()

  const { signTypedDataAsync } = useSignTypedData({
    onError(error: any) {
      setLoading(false)
      toast.error(error?.data?.message ?? error?.message)
    }
  })
  const { data: writtenData, write: writeCollectWithSig } = useContractWrite({
    addressOrName: LENSHUB_PROXY_ADDRESS,
    contractInterface: LENSHUB_PROXY_ABI,
    functionName: 'collectWithSig',
    onError(error: any) {
      setLoading(false)
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [broadcast, { data: broadcastData }] = useMutation(BROADCAST_MUTATION, {
    onError(error) {
      toast.error(error?.message)
      setLoading(false)
    }
  })

  const { indexed } = usePendingTxn(
    writtenData?.hash || broadcastData?.broadcast?.txHash
  )

  useEffect(() => {
    if (indexed) {
      setLoading(false)
      toast.success('Collected as NFT')
    }
  }, [indexed])

  const [createCollectTypedData] = useMutation(CREATE_COLLECT_TYPED_DATA, {
    async onCompleted(data) {
      const { typedData, id } =
        data.createCollectTypedData as CreateCollectBroadcastItemResult
      try {
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, '__typename'),
          types: omitKey(typedData?.types, '__typename'),
          value: omitKey(typedData?.value, '__typename')
        })
        setUserSigNonce(userSigNonce + 1)
        const { v, r, s } = utils.splitSignature(signature)
        const args = {
          collector: address,
          profileId: typedData?.value.profileId,
          pubId: typedData?.value.pubId,
          data: typedData.value.data,
          sig: { v, r, s, deadline: typedData.value.deadline }
        }
        if (RELAYER_ENABLED) {
          const { data } = await broadcast({
            variables: { request: { id, signature } }
          })
          if (data?.broadcast?.reason) writeCollectWithSig({ args })
        } else {
          writeCollectWithSig({ args })
        }
      } catch (error) {
        setLoading(false)
      }
    },
    onError(error) {
      toast.error(error?.message ?? ERROR_MESSAGE)
      setLoading(false)
    }
  })

  const handleMint = (validate = true) => {
    if (!isAuthenticated) return toast.error(SIGN_IN_REQUIRED_MESSAGE)
    const isFreeCollect =
      video.collectModule.__typename === 'FreeCollectModuleSettings'
    const collectModule = video.collectModule as FreeCollectModuleSettings
    if ((!isFreeCollect || collectModule.followerOnly) && validate) {
      return setShowMintModal(true)
    }
    if (!validate) {
      toast('Collecting as NFT...')
      setShowMintModal(false)
    }
    setLoading(true)
    createCollectTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: { publicationId: video?.id }
      }
    })
  }

  return (
    <div>
      {showMintModal && (
        <MintModal
          video={video}
          showModal={showMintModal}
          setShowModal={setShowMintModal}
          handleMint={handleMint}
          minting={loading}
        />
      )}
      <Tooltip
        content={
          loading
            ? 'Minting'
            : video.hasCollectedByMe
            ? 'Mint as NFT again'
            : 'Mint as NFT'
        }
        placement="top"
      >
        <div>
          <Button
            className="!px-2"
            disabled={loading}
            onClick={() => handleMint()}
            size="md"
            variant={variant}
          >
            {loading ? (
              <Loader size="md" />
            ) : (
              <SiOpenmined className="text-xl" />
            )}
          </Button>
        </div>
      </Tooltip>
    </div>
  )
}

export default MintVideo
