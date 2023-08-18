<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { AssetFilter } from '@/types/assets'
import { assertNotUndefined } from '@/utils/validators'

const { profile, setOwnedAssets, setStatus, status, setCreatedAssets } =
  useProfileStore()

const { assetFilter, tokens, nfts } = storeToRefs(useProfileStore())
const { fetchAssets } = useErc725()

const tokensCount = computed(() => {
  const count =
    tokens.value(AssetFilter.owned)?.length +
    nfts.value(AssetFilter.owned)?.length +
    1 // we +1 for LYX token that we show even with 0 balance

  return count
})

const nftsCount = computed(() => {
  const count =
    tokens.value(AssetFilter.created)?.length +
    nfts.value(AssetFilter.created)?.length

  return count
})

onMounted(async () => {
  try {
    setStatus('isAssetLoading', true)
    assertNotUndefined(profile.address)

    setOwnedAssets(await fetchAssets(profile.address, 'LSP5ReceivedAssets[]'))
    setCreatedAssets(await fetchAssets(profile.address, 'LSP12IssuedAssets[]'))
  } catch (error) {
    console.error(error)
  } finally {
    setStatus('isAssetLoading', false)
  }
})
</script>

<template>
  <div>
    <div class="max-w-[835px] py-20 px-4 mx-auto relative">
      <Profile />
      <div
        :class="{
          'opacity-0': status.isAssetLoading,
          'opacity-100': !status.isAssetLoading,
        }"
        class="transition-opacity duration-300"
      >
        <div class="pt-10 gap-4 flex">
          <lukso-button
            size="small"
            variant="secondary"
            :is-active="assetFilter === AssetFilter.owned ? true : undefined"
            :count="tokensCount"
            @click="assetFilter = AssetFilter.owned"
            >{{ $formatMessage('asset_filter_owned_assets') }}</lukso-button
          >
          <lukso-button
            size="small"
            variant="secondary"
            :is-active="assetFilter === AssetFilter.created ? true : undefined"
            :count="nftsCount"
            @click="assetFilter = AssetFilter.created"
            >{{ $formatMessage('asset_filter_created_assets') }}</lukso-button
          >
        </div>
        <TokensList />
        <NftsList />
      </div>
      <lukso-icon
        name="progress-indicator-alt"
        size="x-large"
        v-if="status.isAssetLoading && status.isProfileLoading"
        class="fixed top-[45%] left-1/2 transform"
      ></lukso-icon>
    </div>
  </div>
</template>
