<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { toWei } from 'web3-utils'

import { SupportedAssets } from '@/types/assets'

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

const handleSelectLsp7Asset = (asset: SupportedAssets) => {
  selectedAsset.value = {
    address: asset.address,
    name: 'name' in asset.data ? asset.data.name : '',
    symbol: 'symbol' in asset.data ? asset.data.symbol : '',
    icon: 'icon' in asset.data ? asset.data.icon : '',
    isNativeToken: false,
    standard: asset.standard,
    amount: 'amount' in asset.data ? asset.data.amount : '',
  }
  props.closeModal()
}

const handleSelectLsp8Asset = (asset: SupportedAssets) => {
  selectedAsset.value = {
    address: asset.address,
    name: 'collectionName' in asset.data ? asset.data.collectionName : '',
    symbol: 'collectionSymbol' in asset.data ? asset.data.collectionSymbol : '',
    icon: 'image' in asset.data ? asset.data.image : '',
    isNativeToken: false,
    standard: asset.standard,
    amount: toWei('1'),
  }
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
          :icon="'icon' in asset.data ? asset.data.icon : ''"
          :name="'name' in asset.data ? asset.data.name : ''"
          :symbol="'symbol' in asset.data ? asset.data.symbol : ''"
          :address="asset.address"
          :has-identicon="true"
          :is-selected="
            'name' in asset.data && selectedAsset?.name === asset.data.name
          "
          @click="handleSelectLsp7Asset(asset)"
        />
        <AssetListItem
          v-if="asset.standard === 'LSP8IdentifiableDigitalAsset'"
          :icon="'image' in asset.data ? asset.data.image : ''"
          :name="
            'collectionName' in asset.data ? asset.data.collectionName : ''
          "
          :symbol="
            'collectionSymbol' in asset.data ? asset.data.collectionSymbol : ''
          "
          :address="asset.address"
          :has-identicon="true"
          :has-square-icon="true"
          :is-selected="
            'collectionName' in asset.data &&
            selectedAsset?.name === asset.data.collectionName
          "
          @click="handleSelectLsp8Asset(asset)"
        />
      </li>
    </ul>
  </div>
</template>
