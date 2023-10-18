<script setup lang="ts">
import { Asset } from '@/types/assets'

const { currentNetwork } = useAppStore()
const { ownedAssets } = storeToRefs(useViewedProfileStore())
const { profile: connectedProfile } = useConnectedProfileStore()
const { asset: selectedAsset } = storeToRefs(useSendStore())

type Props = {
  closeModal: () => void
}

const props = defineProps<Props>()

const handleSelectLyx = () => {
  assertAddress(connectedProfile.address, 'profile')
  navigateTo(sendRoute(connectedProfile.address))
  props.closeModal()
}

const handleSelectAsset = (asset: Asset) => {
  assertAddress(connectedProfile.address, 'profile')
  navigateTo({
    path: sendRoute(connectedProfile.address),
    query: {
      asset: asset.address,
    },
  })
  props.closeModal()
}
</script>

<template>
  <div class="bg-neutral-98 text-center p-6 rounded-12 flex flex-col">
    <div
      class="heading-inter-21-semi-bold flex items-center justify-between pb-6"
    >
      {{ $formatMessage('modal_select_assets_title') }}
      <lukso-icon
        name="close-lg"
        class="cursor-pointer"
        @click="closeModal"
      ></lukso-icon>
    </div>
    <ul class="space-y-2 max-h-72 overflow-y-auto -mr-4">
      <li class="mr-4">
        <AssetListItem
          :icon="ASSET_LYX_ICON_URL"
          :name="currentNetwork.token.name"
          :symbol="currentNetwork.token.symbol"
          :is-selected="selectedAsset?.name === currentNetwork.token.name"
          @click="handleSelectLyx"
        />
      </li>
      <li v-for="asset in ownedAssets" :key="asset.address" class="mr-4">
        <AssetListItem
          :icon="getAssetThumb(asset)"
          :name="asset.name"
          :symbol="asset.symbol"
          :address="asset.address"
          :has-identicon="true"
          :has-square-icon="isLsp8(asset)"
          :is-selected="selectedAsset?.name === asset.name"
          @click="handleSelectAsset(asset)"
        />
      </li>
    </ul>
  </div>
</template>
