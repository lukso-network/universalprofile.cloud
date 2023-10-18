<script setup lang="ts">
import { AssetFilter } from '@/types/assets'

const { status } = useViewedProfileStore()

const { assetFilter, tokens, nfts } = storeToRefs(useViewedProfileStore())

const ownedTokensCount = computed(
  () => tokens.value(AssetFilter.owned)?.length + 1 // we +1 for LYX token that we show even with 0 balance
)

const ownedNftsCount = computed(() => nfts.value(AssetFilter.owned)?.length)

const ownedAssetsCount = computed(
  () => ownedTokensCount.value + ownedNftsCount.value
)

const createdTokensCount = computed(
  () => tokens.value(AssetFilter.created)?.length
)

const createdNftsCount = computed(() => nfts.value(AssetFilter.created)?.length)

const createdAssetsCount = computed(
  () => createdTokensCount.value + createdNftsCount.value
)

const hasEmptyCreators = computed(
  () =>
    assetFilter.value === AssetFilter.created &&
    !createdNftsCount.value &&
    !createdTokensCount.value
)

const hasEmptyTokens = computed(
  () =>
    assetFilter.value === AssetFilter.owned ||
    (assetFilter.value === AssetFilter.created && createdTokensCount.value)
)

const hasEmptyNfts = computed(
  () =>
    (assetFilter.value === AssetFilter.owned && ownedNftsCount.value) ||
    (assetFilter.value === AssetFilter.created && createdNftsCount.value)
)

const showProfileDetails = computed(
  () => useRouter().currentRoute.value.query.referrer === REFERRERS.INDEXER
)
</script>

<template>
  <div class="relative">
    <div
      class="max-w-content py-20 px-4 mx-auto relative transition-opacity duration-300"
      :class="{
        'opacity-0': status.isAssetLoading || status.isProfileLoading,
        'opacity-100': !status.isAssetLoading && !status.isProfileLoading,
      }"
    >
      <Profile />
      <ProfileDetails v-if="showProfileDetails" />
      <div>
        <div>
          <div class="pt-10 gap-4 flex">
            <lukso-button
              size="small"
              variant="secondary"
              :is-active="assetFilter === AssetFilter.owned ? true : undefined"
              :count="ownedAssetsCount"
              @click="assetFilter = AssetFilter.owned"
              >{{ $formatMessage('asset_filter_owned_assets') }}</lukso-button
            >
            <lukso-button
              size="small"
              variant="secondary"
              :is-active="
                assetFilter === AssetFilter.created ? true : undefined
              "
              :count="createdAssetsCount"
              @click="assetFilter = AssetFilter.created"
              >{{ $formatMessage('asset_filter_created_assets') }}</lukso-button
            >
          </div>

          <div v-if="hasEmptyCreators" class="pt-8">
            <h3 class="heading-inter-17-semi-bold pb-2">
              {{ $formatMessage('assets_empty_state_title') }}
            </h3>
            <lukso-sanitize
              :html-content="$formatMessage('assets_empty_state_description')"
            ></lukso-sanitize>
          </div>
          <div v-else>
            <TokenList v-if="hasEmptyTokens" />
            <NftList v-if="hasEmptyNfts" />
          </div>
        </div>
      </div>
    </div>
    <lukso-icon
      name="progress-indicator-alt"
      size="x-large"
      v-if="status.isAssetLoading || status.isProfileLoading"
      class="absolute top-1/2 left-1/2 transform"
    ></lukso-icon>
  </div>
</template>
