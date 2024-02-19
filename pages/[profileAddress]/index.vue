<script setup lang="ts">
import { AssetRepository } from '@/repositories/asset'

import type { Asset } from '@/models/asset'

const { assetFilter, isLoadingAssets } = storeToRefs(useAppStore())
const { viewedProfile } = useViewedProfile()
const assetRepository = useRepo(AssetRepository)
const { isMobile } = useDevice()
const tokensOwned = ref<Asset[]>()
const tokensCreated = ref<Asset[]>()
const nftsOwned = ref<Asset[]>()
const nftsCreated = ref<Asset[]>()

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

watchEffect(async () => {
  tokensOwned.value = await assetRepository.getOwnedTokens()
  tokensCreated.value = await assetRepository.getIssuedTokens()
  nftsOwned.value = await assetRepository.getOwnedNfts()
  nftsCreated.value = await assetRepository.getIssuedNfts()
})
</script>

<template>
  <div class="relative">
    <AppPageLoader>
      <div class="mx-auto max-w-content">
        <ProfileCard />
        <ProfileDetails v-if="showProfileDetails" />
        <div>
          <div>
            <div class="grid grid-cols-2 gap-4 pt-10 sm:flex">
              <lukso-button
                size="small"
                variant="secondary"
                :is-active="
                  assetFilter === AssetFilter.owned ? true : undefined
                "
                :is-full-width="isMobile ? true : undefined"
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
                :is-full-width="isMobile ? true : undefined"
                :count="createdAssetsCount"
                @click="assetFilter = AssetFilter.created"
                >{{
                  $formatMessage('asset_filter_created_assets')
                }}</lukso-button
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
      </div>
    </AppPageLoader>
  </div>
</template>
