<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
type Props = {
  asset?: Asset | null
}
const props = defineProps<Props>()
const asset = computed(() => props.asset)
const token = useToken()(asset)
const { showModal } = useModal()
const { isConnected } = storeToRefs(useAppStore())

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.value?.address, 'profile')
    assertAddress(token.value?.address, 'token')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: token.value.address,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

const handlePreviewImage = () => {
  const image = token.value?.resolvedMetadata?.icon

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
  {{ console.debug(token?.tokenName, toRaw(token)) }}
  <div class="relative">
    <div
      class="relative mx-auto grid max-w-content gap-12 transition-opacity duration-300 md:grid-cols-[1fr,2fr]"
    >
      <div>
        <lukso-card
          class="cursor-pointer"
          is-full-width
          border-radius="small"
          shadow="small"
          @click="handlePreviewImage"
        >
          <div
            slot="content"
            class="flex min-h-64 items-center justify-center p-6 sm:py-10 md:py-20"
          >
            <lukso-profile
              v-if="asset"
              size="large"
              :profile-url="
                getAssetThumb(asset, isLsp7(asset), 60) ||
                ASSET_ICON_PLACEHOLDER_URL
              "
              class="rounded-full shadow-neutral-above-shadow-1xl"
            ></lukso-profile>
          </div>
        </lukso-card>
        <div v-if="token?.balance && isConnected">
          <AssetOwnInfo
            :address="connectedProfile?.address"
            :balance="token?.balance"
            :symbol="token?.tokenSymbol"
            :decimals="token?.decimals"
            :profile-image-url="
              getOptimizedImage(connectedProfile?.profileImage, 260)
            "
            :message="$formatMessage('token_details_own')"
          />

          <lukso-button is-full-width class="mt-12" @click="handleSendAsset">{{
            $formatMessage('token_details_send', {
              token: token?.tokenSymbol || '',
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium flex items-center gap-2 pb-2">
          {{ token?.tokenName }}
          <AssetStandardBadge :standard="token?.standard" />
        </div>
        <AssetTokenSupply
          :total-supply="token?.totalSupply"
          :decimals="token?.decimals"
          class="pb-8"
        />
        <AssetDescription
          v-if="token?.resolvedMetadata?.description"
          :description="token?.resolvedMetadata?.description"
        />
        <AssetImages
          v-if="token?.resolvedMetadata?.images?.length"
          :images="token?.resolvedMetadata?.images"
        />
        <AssetAssets
          v-if="token?.resolvedMetadata?.assets?.length"
          :assets="token?.resolvedMetadata?.assets"
        />
        <AssetAttributes :attributes="asset?.resolvedMetadata?.attributes" />
        <AssetLinks
          v-if="token?.resolvedMetadata?.links?.length"
          :links="token?.resolvedMetadata?.links"
        />
        <AssetAddress v-if="token?.address" :address="token.address" />
      </div>
    </div>
  </div>
</template>
