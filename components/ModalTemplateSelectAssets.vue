<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { asset: selectedAsset } = storeToRefs(useSendStore())

type Props = {
  closeModal: () => void
}

const profileAddress = computed(() => connectedProfile.value?.address || null)
const props = defineProps<Props>()
const allTokens = useProfileAssets()(profileAddress)

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

const ownedAssets = computed(() =>
  allTokens.value
    // unwrap token Ids into main array
    ?.flatMap(token => {
      if (isLsp8(token)) {
        return token?.tokenIdsData?.map(tokenIdsData => ({
          ...tokenIdsData,
        }))
      }
      return [token]
    })
    // remove potential undefined from array
    ?.filter(item => item !== undefined)
    // pick only the ones with balance/owned/in right standard
    ?.filter(
      ({ isOwned, standard, balance }) =>
        isOwned &&
        (standard === 'LSP7DigitalAsset' ||
          standard === 'LSP8IdentifiableDigitalAsset') &&
        balance !== '0'
    )
    // sort so LSP7 tokens are first in the list
    .sort((a: Asset, _b: Asset) => {
      if (isToken(a)) {
        return -1
      }

      if (isCollectible(a)) {
        return 1
      }

      return 0
    })
)
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <div
      class="heading-inter-21-semi-bold flex items-center justify-between pb-6"
    >
      {{ $formatMessage('modal_select_assets_title') }}
      <ModalCloseButton @click="closeModal" />
    </div>
    <ul class="-mr-4 max-h-72 space-y-2 overflow-y-auto">
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
