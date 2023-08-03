<script setup lang="ts">
import { fetchLSP7Assets } from '@/utils/fetchLSP7Assets'
import { fetchLSP8Assets } from '@/utils/fetchLSP8Assets'

enum AssetFilter {
  owned = 'owned',
  created = 'created',
}

const assetFilter = ref<AssetFilter>(AssetFilter.owned)
const { setLsp7Assets, setLsp8Assets } = useAssetsStore()

try {
  setLsp7Assets(fetchLSP7Assets())
  setLsp8Assets(fetchLSP8Assets())
} catch (error) {
  console.error(error)
}
</script>

<template>
  <div>
    <div class="max-w-[835px] py-20 px-4 mx-auto">
      <Profile />
      <div class="pt-10 gap-4 flex">
        <lukso-button
          size="small"
          variant="secondary"
          :is-active="assetFilter === AssetFilter.owned ? true : undefined"
          :count="8"
          @click="assetFilter = AssetFilter.owned"
          >{{ $formatMessage('asset_filter_owned_assets') }}</lukso-button
        >
        <lukso-button
          size="small"
          variant="secondary"
          :is-active="assetFilter === AssetFilter.created ? true : undefined"
          :count="3"
          @click="assetFilter = AssetFilter.created"
          >{{ $formatMessage('asset_filter_created_assets') }}</lukso-button
        >
      </div>
      <Lsp7AssetList />
      <Lsp8AssetList />
    </div>
  </div>
</template>
