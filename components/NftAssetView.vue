<script setup lang="ts">
import type { Asset } from '@/types/asset'

type Props = {
  asset?: Asset | null
}
const props = defineProps<Props>()

const connectedProfile = useProfile().connectedProfile()
const asset = computed(() => props.asset)
const token = useToken()(asset)
const { showModal } = useModal()
const { isConnected } = storeToRefs(useAppStore())
const profileAvatar = useProfileAvatar(connectedProfile, 40)

const handleSendAsset = (event: Event) => {
  event.stopPropagation()

  let query: SendQueryParams = {
    asset: props.asset?.address,
    tokenId: props.asset?.tokenId,
  }

  if (isCollectible(props.asset)) {
    query = {
      ...query,
      amount: '1', // prefill amount field for collectibles
    }
  }

  navigateTo({
    path: sendRoute(connectedProfile.value?.address),
    query,
  })
}

const handlePreviewImage = () => {
  const image = token.value?.resolvedMetadata?.images?.[0]

  if (!image) {
    return
  }

  showModal({
    template: 'AssetImage',
    data: {
      asset: image,
    },
    size: 'auto',
  })
}
</script>

<template>
  {{ genericLog(token?.tokenName, toRaw(token)) }}
  <div
    class="relative mx-auto grid max-w-content gap-12 transition-opacity duration-300 md:grid-cols-[1fr,2fr]"
  >
    <div>
      <NftCard :asset="asset" @on-image-click="handlePreviewImage" />
      <div v-if="asset?.balance !== '0' && isConnected">
        <AssetOwnInfo
          :address="connectedProfile?.address"
          :balance="asset?.balance"
          :symbol="asset?.tokenSymbol"
          :decimals="0"
          :profile-image-url="profileAvatar?.url"
          :message="$formatMessage('nft_details_own')"
        />

        <lukso-button is-full-width class="mt-12" @click="handleSendAsset">{{
          $formatMessage('token_details_send_collectible')
        }}</lukso-button>
      </div>
    </div>
    <div>
      <div class="heading-apax-24-medium flex items-center gap-2 pb-2">
        <AssetName :asset="asset" />
        <AssetStandardBadge :asset="asset" />
      </div>
      <AssetCollectionSupply :asset="asset" />
      <AssetTokenId :asset="asset" />
      <AssetDescription :asset="token" class="mb-8" />
      <AssetImagesList :asset="token" />
      <AssetAssets :asset="token" />
      <AssetAttributes :asset="token" />
      <AssetCreators :asset="token" />
      <AssetLinks :asset="token" class="mb-8" />
      <AssetAddress :asset="asset" />
    </div>
  </div>
</template>
