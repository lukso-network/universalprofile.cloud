<script setup lang="ts">
import { Asset } from '@/models/asset'

type Props = {
  asset: Asset
  hasAddress?: boolean
}

const props = defineProps<Props>()

const { isConnected } = useAppStore()
const { connectedProfile } = useConnectedProfile()
const { viewedProfile } = useViewedProfile()

const verifiedCreator = computed(() => {
  return props.asset?.creators?.find(creator => creator?.isVerified)
})

const handleShowAsset = () => {
  try {
    assertAddress(viewedProfile.value?.address, 'profile')
    assertAddress(props.asset?.address)
    assertString(props.asset.tokenId)
    navigateTo(
      nftRoute(
        viewedProfile.value.address,
        props.asset.address,
        props.asset.tokenId
      )
    )
  } catch (error) {
    console.error(error)
  }
}

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.value?.address, 'profile')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: props.asset?.address,
      },
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <lukso-card size="small" is-hoverable is-full-width @click="handleShowAsset"
    ><div slot="content">
      <div
        class="min-h-[260px] bg-neutral-90 w-100 rounded-t-12 bg-center bg-cover"
        :style="`background-image: url(${getAssetThumb(asset)});`"
      ></div>
      <div class="p-4 relative">
        <AssetCreator
          :creator="verifiedCreator"
          class="relative -mt-4 -top-4"
        />
        <div>
          <div class="paragraph-inter-14-semi-bold">
            {{ asset?.name }}
          </div>
          <div class="paragraph-inter-12-semi-bold pb-2">
            {{ asset?.amount }}
            <span class="text-neutral-60">{{ asset?.symbol }}</span>
          </div>
          <div class="flex justify-end w-full">
            <lukso-button
              v-if="
                isConnected &&
                viewedProfile?.address === connectedProfile?.address
              "
              size="small"
              variant="secondary"
              @click="handleSendAsset"
              class="transition-opacity hover:opacity-70"
              >{{ $formatMessage('button_send') }}</lukso-button
            >
          </div>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
