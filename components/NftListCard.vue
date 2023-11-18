<script setup lang="ts">
import { Asset } from '@/models/asset'
import { CreatorRepository } from '@/repositories/creator'

type Props = {
  asset: Asset
  hasAddress?: boolean
}

const props = defineProps<Props>()

const { isConnected } = storeToRefs(useAppStore())
const { connectedProfile } = useConnectedProfile()
const { viewedProfile } = useViewedProfile()
const creatorsRepository = useRepo(CreatorRepository)

const verifiedCreator = computed(() => {
  return creatorsRepository
    .getAssetCreators(props.asset?.address, props.asset?.tokenId)
    .find(creator => creator?.isVerified)
})

const handleShowAsset = () => {
  try {
    assertAddress(props.asset?.address)
    assertString(props.asset.tokenId)
    navigateTo(nftRoute(props.asset.address, props.asset.tokenId))
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
        tokenId: props.asset?.tokenId,
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
        class="min-h-[260px] rounded-t-12 bg-neutral-90 bg-cover bg-center"
        :style="`background-image: url(${getAssetThumb(asset)});`"
      ></div>
      <div class="relative p-4">
        <AssetCreator
          :creator="verifiedCreator"
          class="relative -top-4 -mt-4"
        />
        <div>
          <div class="paragraph-inter-14-semi-bold">
            {{ asset?.name }}
          </div>
          <div class="paragraph-inter-12-semi-bold pb-2">
            {{ asset?.balance }}
            <span class="text-neutral-60">{{ asset?.symbol }}</span>
          </div>
          <div class="flex w-full justify-end">
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
