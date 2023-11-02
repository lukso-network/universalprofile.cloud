<script setup lang="ts">
import { Asset } from '@/models/asset'
import { AssetRepository } from '@/repositories/asset'

const { currentNetwork } = useAppStore()
const { connectedProfile } = useConnectedProfile()
const { asset: selectedAsset } = storeToRefs(useSendStore())
const assetRepository = useRepo(AssetRepository)
const ownedAssets = ref<Asset[]>()

type Props = {
  closeModal: () => void
}

const props = defineProps<Props>()

onMounted(() => {
  ownedAssets.value = assetRepository.getOwnedAssets()
})

const handleSelectLyx = () => {
  assertAddress(connectedProfile.value?.address, 'profile')
  navigateTo(sendRoute(connectedProfile.value.address))
  props.closeModal()
}

const handleSelectAsset = (asset: Asset) => {
  assertAddress(connectedProfile.value?.address, 'profile')
  navigateTo({
    path: sendRoute(connectedProfile.value.address),
    query: {
      asset: asset?.address,
      tokenId: asset?.tokenId ? asset?.tokenId : undefined,
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
          :is-selected="selectedAsset?.isNativeToken"
          @click="handleSelectLyx"
        />
      </li>
      <li v-for="asset in ownedAssets" :key="asset?.address" class="mr-4">
        <AssetListItem
          :icon="getAssetThumb(asset, isLsp7(asset))"
          :name="asset?.name"
          :symbol="asset?.symbol"
          :address="asset?.address"
          :has-identicon="true"
          :has-square-icon="isLsp8(asset)"
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
