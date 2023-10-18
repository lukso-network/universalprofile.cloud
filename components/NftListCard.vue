<script setup lang="ts">
import { Asset } from '@/types/assets'

type Props = {
  asset: Asset
  hasAddress?: boolean
}

const props = defineProps<Props>()

const { profile: connectedProfile, status } = useConnectedProfileStore()
const { profile: viewedProfile } = useViewedProfileStore()

const handleShowAsset = () => {
  try {
    assertAddress(viewedProfile.address, 'profile')
    assertAddress(props.asset.address)
    assertString(props.asset.tokenId)
    navigateTo(
      nftRoute(viewedProfile.address, props.asset.address, props.asset.tokenId)
    )
  } catch (error) {
    console.error(error)
  }
}

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.address, 'profile')
    navigateTo({
      path: sendRoute(connectedProfile.address),
      query: {
        asset: props.asset.address,
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
      <div class="p-4">
        <div
          v-if="asset.creatorAddress"
          class="shadow-neutral-drop-shadow p-2 pr-6 rounded-4 inline-flex -top-6 relative bg-neutral-100"
        >
          <lukso-profile
            size="x-small"
            :profile-url="asset.creatorProfileImage"
          ></lukso-profile>
          <div class="pl-1">
            <div class="text-neutral-60 paragraph-inter-10-semi-bold">
              {{ $formatMessage('asset_created_by') }}
            </div>
            <lukso-username
              :name="asset.creatorName"
              :address="asset.creatorAddress"
              size="x-small"
              class="flex"
              name-color="neutral-20"
            ></lukso-username>
          </div>
        </div>
        <div>
          <div class="paragraph-inter-14-semi-bold">
            {{ asset.name }}
          </div>
          <div class="paragraph-inter-12-semi-bold pb-2">
            1
            <span class="text-neutral-60">{{ asset.symbol }}</span>
          </div>
          <div class="flex justify-end w-full">
            <lukso-button
              v-if="
                status.isConnected &&
                viewedProfile.address === connectedProfile.address
              "
              size="small"
              variant="secondary"
              @click="handleSendAsset"
              >{{ $formatMessage('button_send') }}</lukso-button
            >
          </div>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
