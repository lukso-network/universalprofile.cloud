<script setup lang="ts">
import { Asset } from '@/models/asset'
import { AssetRepository } from '@/repositories/asset'

const { currentNetwork } = useAppStore()
const { connectedProfile } = useConnectedProfile()
const { asset: selectedAsset } = storeToRefs(useSendStore())
const assetRepository = useRepo(AssetRepository)
const ownedAssets = ref<Asset[]>([])

type Props = {
  closeModal: () => void
}

const props = defineProps<Props>()

onMounted(async () => {
  // for each asset we look for cached image
  for await (const asset of assetRepository.getOwnedAssets()) {
    const assetWithImage = {
      ...asset,
      iconUrl: await getAssetThumb(asset, isToken(asset)),
    }
    ownedAssets?.value?.push(assetWithImage)
  }
  console.log(ownedAssets)
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
          :icon="asset?.iconUrl"
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
