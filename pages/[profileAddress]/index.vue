<script setup lang="ts">
import { AssetFilter } from '@/types/assets'
import { AssetRepository } from '@/repositories/asset'
import { Asset } from '@/models/asset'

const { isLoadingProfile, isLoadingAssets, assetFilter, isLoadedApp } =
  storeToRefs(useAppStore())
const assetRepository = useRepo(AssetRepository)
const tokensOwned = ref<Asset[]>()
const tokensCreated = ref<Asset[]>()
const nftsOwned = ref<Asset[]>()
const nftsCreated = ref<Asset[]>()

// tokens
const ownedTokensCount = computed(
  () => (tokensOwned.value?.length || 0) + 1 // we +1 for LYX token that we show even with 0 balance
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

watchEffect(async () => {
  tokensOwned.value = await assetRepository.getOwnedTokens()
  tokensCreated.value = await assetRepository.getIssuedTokens()
  nftsOwned.value = await assetRepository.getOwnedNfts()
  nftsCreated.value = await assetRepository.getIssuedNfts()
})
</script>

<template>
  <div class="relative">
    <div
      class="max-w-content py-20 px-4 mx-auto relative transition-opacity duration-300"
      :class="{
        'opacity-0': isLoadingAssets || isLoadingProfile || !isLoadedApp,
        'opacity-100': !isLoadingAssets && !isLoadingProfile && isLoadedApp,
      }"
    >
      <ProfileCard />
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
            <TokenList v-if="hasEmptyTokens" :tokens="tokens" />
            <NftList v-if="hasEmptyNfts" :nfts="nfts" />
          </div>
        </div>
      </div>
    </div>
    <AppLoader v-if="isLoadingAssets || isLoadingProfile || !isLoadedApp" />
  </div>
</template>
