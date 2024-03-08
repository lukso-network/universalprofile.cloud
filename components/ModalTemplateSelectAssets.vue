<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { asset: selectedAsset } = storeToRefs(useSendStore())

type Props = {
  closeModal: () => void
}

const props = defineProps<Props>()
const allTokens = useProfileAssets()(connectedProfile.value?.address)
const { currentNetwork } = storeToRefs(useAppStore())

const handleSelectLyx = () => {
  selectedAsset.value = {
    tokenName: currentNetwork.value.token.name,
    tokenSymbol: currentNetwork.value.token.symbol,
    isNativeToken: true,
    decimals: ASSET_LYX_DECIMALS,
  }
  props.closeModal()
}

const handleSelectAsset = (asset: Asset) => {
  assertAddress(connectedProfile?.value?.address, 'profile')
  selectedAsset.value = asset
  props.closeModal()
}

const ownedAssets = computed(() =>
  allTokens.value?.filter(
    ({ isOwned, standard, balance }) =>
      isOwned &&
      (standard === 'LSP7DigitalAsset' ||
        standard === 'LSP8IdentifiableDigitalAsset') &&
      balance !== '0'
  )
)
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
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
    <ul class="-mr-4 max-h-72 space-y-2 overflow-y-auto">
      <li class="mr-4">
        <AssetListItem
          :icon="ASSET_LYX_ICON_URL"
          :name="currentNetwork.token.name"
          :symbol="currentNetwork.token.symbol"
          :is-selected="selectedAsset?.isNativeToken"
          @click="handleSelectLyx"
        />
      </li>
      <li v-for="asset in ownedAssets" :key="asset?.address" class="mr-4">
        <AssetListItem
          :icon="getAssetThumb(asset, !isCollectible(asset), 80)"
          :name="asset?.tokenName"
          :symbol="asset?.tokenSymbol"
          :address="asset?.address"
          :has-identicon="true"
          :has-square-icon="isCollectible(asset)"
          :is-selected="
            selectedAsset?.address === asset?.address &&
            selectedAsset?.tokenId === asset?.tokenId
          "
          @click="handleSelectAsset(asset)"
        />
      </li>
    </ul>
  </div>
</template>
