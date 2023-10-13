<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { Asset } from '@/types/assets'

const { currentNetwork } = useAppStore()
const { ownedAssets } = storeToRefs(useViewedProfileStore())
const { profile: viewedProfile } = useViewedProfileStore()
const { asset: selectedAsset } = storeToRefs(useSendStore())

type Props = {
  closeModal: () => void
}

const props = defineProps<Props>()

const handleSelectLyx = () => {
  console.log(viewedProfile.balance)
  selectedAsset.value = {
    name: currentNetwork.token.name,
    symbol: currentNetwork.token.symbol,
    icon: ASSET_LYX_ICON_URL,
    isNativeToken: true,
    amount: viewedProfile.balance,
  }
  props.closeModal()
}

const handleSelectAsset = (asset: Asset) => {
  selectedAsset.value = asset
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
    <ul class="space-y-2">
      <li>
        <AssetListItem
          :icon="ASSET_LYX_ICON_URL"
          :name="currentNetwork.token.name"
          :symbol="currentNetwork.token.symbol"
          :is-selected="selectedAsset?.name === currentNetwork.token.name"
          @click="handleSelectLyx"
        />
      </li>
      <li v-for="asset in ownedAssets" :key="asset.address">
        <AssetListItem
          v-if="asset.standard === 'LSP7DigitalAsset'"
          :icon="asset.icon"
          :name="asset.name"
          :symbol="asset.symbol"
          :address="asset.address"
          :has-identicon="true"
          :is-selected="selectedAsset?.name === asset.name"
          @click="handleSelectAsset(asset)"
        />
        <AssetListItem
          v-if="asset.standard === 'LSP8IdentifiableDigitalAsset'"
          :icon="asset.icon"
          :name="asset.name"
          :symbol="asset.symbol"
          :address="asset.address"
          :has-identicon="true"
          :has-square-icon="true"
          :is-selected="selectedAsset?.name === asset.name"
          @click="handleSelectAsset(asset)"
        />
      </li>
    </ul>
  </div>
</template>
