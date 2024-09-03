<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { asset: selectedAsset } = storeToRefs(useSendStore())
const { isRpc } = storeToRefs(useAppStore())

type Props = {
  closeModal: () => void
}

const profileAddress = computed(() => connectedProfile.value?.address || null)
const props = defineProps<Props>()
const allAssets = useProfileHolds()(profileAddress)
const isLoadingAssets = computed(() =>
  allAssets.value?.some(asset => asset.isLoading)
)

const handleSelectLyx = () => {
  navigateTo({
    path: sendRoute(connectedProfile.value?.address),
  })
  props.closeModal()
}

const handleSelectAsset = (asset: Asset) => {
  sendLog('Selected asset', toRaw(asset))

  let query: SendQueryParams = { asset: asset?.address }

  if (isLsp8(asset)) {
    query = {
      ...query,
      tokenId: asset?.tokenId,
    }
  }

  if (isCollectible(asset)) {
    query = {
      ...query,
      amount: '1', // prefill amount field for collectibles
    }
  }

  navigateTo({
    path: sendRoute(connectedProfile.value?.address),
    query,
  })

  props.closeModal()
}

const ownedAssets = computed(() => {
  let allAssetsFiltered = allAssets.value || []

  if (isRpc.value) {
    // in RPC mode unwrap token Ids into main array
    allAssetsFiltered = allAssetsFiltered?.flatMap(token => {
      if (isLsp8(token) && token?.tokenIdsData) {
        return (
          token?.tokenIdsData?.map(tokenIdsData => ({
            ...tokenIdsData,
          })) || []
        )
      }
      return [token]
    })
  }

  allAssetsFiltered = allAssetsFiltered
    // remove potential undefined from array
    ?.filter(item => item !== undefined)
    // pick only the ones with balance/owned/in right standard
    ?.filter(
      asset => asset.isOwned && isSupportedAsset(asset) && hasBalance(asset)
    )

  console.log('allAssets', allAssets.value)
  console.log('allAssetsFiltered', allAssetsFiltered)

  const allTokens =
    allAssetsFiltered
      ?.filter(asset => isToken(asset))
      // sort by name
      ?.slice()
      ?.sort((a, b) => stringSort(a.tokenName, b.tokenName)) || []

  const allCollectibles =
    allAssetsFiltered
      ?.filter(asset => isCollectible(asset))
      // sort by name
      ?.slice()
      ?.sort((a, b) => stringSort(a.tokenName, b.tokenName)) || []

  return [...allTokens, ...allCollectibles]
})
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <div
      class="heading-inter-21-semi-bold flex items-center justify-between pb-6"
    >
      {{ $formatMessage('modal_select_assets_title') }}
      <ModalCloseButton @click="closeModal" />
    </div>
    <div v-if="isLoadingAssets" class="relative h-72">
      <AppLoader class="absolute left-[calc(50%-20px)] top-[calc(50%-20px)]" />
    </div>
    <ul v-else class="-mr-4 max-h-72 space-y-2 overflow-y-auto">
      <li class="mr-4">
        <SelectAssetsLyx
          :is-selected="selectedAsset?.isNativeToken"
          @click="handleSelectLyx"
        />
      </li>
      <li v-for="asset in ownedAssets" :key="asset?.address" class="mr-4">
        <SelectAssetsToken
          :asset="asset"
          :is-selected="
            selectedAsset?.address === asset?.address &&
            selectedAsset?.tokenId === asset?.tokenId
          "
          @on-select="handleSelectAsset"
        />
      </li>
    </ul>
  </div>
</template>
