<script setup lang="ts">
type Props = {
  asset?: Asset | null
}

const props = defineProps<Props>()
const { isMobile } = useDevice()
const asset = computed(() => props.asset)
const token = useToken()(asset)
const assetImage = useAssetImage(token, false, 880)
</script>

<template>
  <lukso-card
    variant="dapp"
    :background-url="assetImage?.url"
    shadow="small"
    class="mb-12"
  >
    <div slot="content" class="break-words p-6">
      <div
        class="mb-4 flex flex-col gap-4 border-b border-b-neutral-90 pb-4 sm:gap-3"
      >
        <div
          class="grid grid-cols-1 gap-4 sm:grid-cols-[auto,max-content] sm:gap-0"
        >
          <div class="flex flex-col gap-2">
            <div class="heading-inter-17-semi-bold flex gap-2">
              <AssetName :asset="asset" />
              <AssetStandardBadge :asset="asset" />
            </div>
            <AssetCollectionSupply :asset="asset" />
          </div>
          <div>
            <NftListCardCreators
              :asset="token"
              :has-verification="false"
              :is-small="false"
            />
          </div>
        </div>
        <div class="flex justify-start">
          <AssetAddress :asset="asset" without-title show-contract-link />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <AssetDescription :asset="token" without-title />
        <AssetLinks
          :asset="token"
          without-title
          :button-size="isMobile ? 'medium' : 'small'"
        />
      </div>
    </div>
  </lukso-card>
</template>
