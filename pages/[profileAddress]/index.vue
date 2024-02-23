<script setup lang="ts">
import { AssetRepository } from '@/repositories/asset'

// import type { Asset } from '@/models/asset'

const { assetFilter, isLoadingAssets } = storeToRefs(useAppStore())
const { viewedProfile } = useViewedProfile()
const assetRepository = useRepo(AssetRepository)
const { isMobile } = useDevice()

const tokensOwned = computed(() => assetRepository.getOwnedTokens())
const tokensCreated = computed(() => assetRepository.getIssuedTokens())
const nftsOwned = computed(() => assetRepository.getOwnedNfts())
const nftsCreated = computed(() => assetRepository.getIssuedNfts())

// tokens
const ownedTokensCount = computed(
  () =>
    (tokensOwned.value?.length || 0) +
    (viewedProfile.value?.balance !== '0' ? 1 : 0) // +1 if user has LYX token
)

const createdTokensCount = computed(() => tokensCreated.value?.length || 0)

const tokens = computed(() => {
  if (assetFilter.value === AssetFilter.owned) {
    return tokensOwned.value
  } else {
    return tokensCreated.value
  }
})

// NFTs
const ownedNftsCount = computed(() => nftsOwned.value?.length || 0)

const createdNftsCount = computed(() => nftsCreated.value?.length || 0)

const nfts = computed(() => {
  if (assetFilter.value === AssetFilter.owned) {
    return nftsOwned.value
  } else {
    return nftsCreated.value
  }
})

// assets (tokens + NFTs)
const ownedAssetsCount = computed(
  () => ownedTokensCount.value + ownedNftsCount.value
)

const createdAssetsCount = computed(
  () => createdTokensCount.value + createdNftsCount.value
)

// empty states
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
  <AppPageLoader>
    <div
      v-if="viewedProfile?.standard === 'LSP3Profile'"
      class="mx-auto max-w-content"
    >
      <ProfileCard />
      <ProfileDetails v-if="showProfileDetails" />
      <div>
        <div class="grid grid-cols-2 gap-4 pt-10 sm:flex">
          <lukso-button
            size="small"
            variant="secondary"
            :is-active="assetFilter === AssetFilter.owned ? true : undefined"
            :is-full-width="isMobile ? true : undefined"
            :count="ownedAssetsCount"
            @click="assetFilter = AssetFilter.owned"
            >{{ $formatMessage('asset_filter_owned_assets') }}</lukso-button
          >
          <lukso-button
            size="small"
            variant="secondary"
            :is-active="assetFilter === AssetFilter.created ? true : undefined"
            :is-full-width="isMobile ? true : undefined"
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
          <TokenList v-if="hasEmptyTokens" :tokens="tokens" />
          <NftList v-if="hasEmptyNfts" :nfts="nfts" />
          <AppLoader
            v-if="isLoadingAssets"
            class="relative left-[calc(50%-20px)] mt-20"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="mx-auto flex h-full max-w-72 flex-col items-center justify-center text-center"
    >
      <img src="/images/up-error.png" alt="" class="mb-6 w-36" />
      <div class="heading-inter-21-semi-bold mb-4">
        {{ $formatMessage('not_up_title') }}
      </div>
      <div class="paragraph-inter-16-regular mb-6">
        {{ $formatMessage('not_up_description') }}
      </div>
      <lukso-button
        variant="landing"
        is-link
        :href="explorerContractUrl(viewedProfile?.address)"
        class="mb-8"
        >{{ $formatMessage('not_up_button') }}</lukso-button
      >
    </div>
  </AppPageLoader>
</template>
