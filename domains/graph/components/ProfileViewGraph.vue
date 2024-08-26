<script setup lang="ts">
export type ProfileViewTabName = 'collectibles' | 'tokens'
export type ProfileViewTab = { id: ProfileViewTabName; count: number }

const { isOwned, setFilters, filters } = useFilters()
const viewedProfileAddress = getCurrentProfileAddress()

const viewedProfile = useProfile().getProfile(viewedProfileAddress)
const assetsData = useProfileAssetsGraph()({
  profileAddress: viewedProfileAddress,
})
const assets = computed(() => assetsData.data.value || [])
const isLoadingAssets = computed(() => assetsData.isLoading.value)

const filteredAssets = computed(() => {
  return (
    assets.value
      // filter by owned/created
      .filter(asset => {
        switch (filters.assetType) {
          case 'owned':
            return asset.isOwned && hasBalance(asset) // for owned we need to check if user has balance
          case 'created':
            return asset.isIssued
          default:
            return false
        }
      })
      // filter token/collectible
      .filter(asset => {
        switch (filters.assetGroup) {
          case 'collectibles':
            return isCollectible(asset)
          case 'tokens':
            return isToken(asset)
          default:
            return false
        }
      })
  )
})

const creationsShowcase = computed(() =>
  assets.value
    ?.slice()
    ?.sort((a, b) => stringSort(a.tokenName, b.tokenName, 'asc'))
    ?.filter(
      asset =>
        asset.isIssued &&
        isCollectible(asset) &&
        isCreator(asset, viewedProfileAddress)
    )
)

// tokens
const ownedTokensCount = computed(
  () =>
    assets.value.filter(
      asset => asset.isOwned && isToken(asset) && hasBalance(asset)
    ).length + (hasBalance(viewedProfile?.value) ? 1 : 0) // +1 if user has LYX token
)

const createdTokensCount = computed(
  () => assets.value.filter(asset => asset.isIssued && isToken(asset)).length
)

// collectibles
const ownedCollectiblesCount = computed(
  () =>
    assets.value.filter(
      asset => asset.isOwned && isCollectible(asset) && hasBalance(asset)
    ).length
)

const createdCollectiblesCount = computed(
  () =>
    assets.value.filter(
      asset =>
        asset.isIssued &&
        isCollectible(asset) &&
        isCreator(asset, viewedProfileAddress)
    ).length
)

const handleTabChange = (tab: ProfileViewTabName) => {
  setFilters({ assetGroup: tab }, undefined, true)
}

const tabs = computed(() => {
  return [
    {
      id: 'collectibles',
      count: isOwned.value
        ? ownedCollectiblesCount.value
        : createdCollectiblesCount.value,
    },
    {
      id: 'tokens',
      count: isOwned.value ? ownedTokensCount.value : createdTokensCount.value,
    },
  ]
})

const selectTabBasedOnAssetCounts = () => {
  // when user has no collectibles, we show tokens first
  // when user has collectibles, we show created ones first
  const assetGroup =
    ownedCollectiblesCount.value > 0 || createdCollectiblesCount.value
      ? 'collectibles'
      : 'tokens'
  const assetType =
    assetGroup === 'collectibles' && createdCollectiblesCount.value > 0
      ? 'created'
      : 'owned'
  setFilters({
    assetType,
    assetGroup,
  })
}

onMounted(() => {
  selectTabBasedOnAssetCounts()
})
</script>

<template>
  <AppPageLoader :is-loading="viewedProfile?.isLoading">
    <div
      v-if="viewedProfile?.standard === STANDARDS.LSP3"
      class="mx-auto max-w-content"
    >
      <ProfileCard />
      <ProfileDetails />
      <div
        v-if="createdCollectiblesCount > 0"
        class="heading-inter-17-semi-bold my-10 flex items-center justify-center"
      >
        {{ $formatMessage('asset_creations') }}
        <span
          class="paragraph-inter-10-semi-bold ml-2 rounded-4 border border-neutral-20 bg-neutral-20 px-1 py-[1px] text-neutral-100"
          >{{ createdCollectiblesCount }}</span
        >
      </div>
      <CreationsCarousel
        v-if="createdCollectiblesCount > 0"
        :assets="creationsShowcase"
        class="mb-10"
      />
      <div>
        <ProfileTabs
          :active-tab="filters.assetGroup"
          :tabs="tabs"
          @activate-tab="handleTabChange"
          class="mt-20"
        />
        <ProfileAssetsGraph
          :assets="filteredAssets"
          :is-loading="isLoadingAssets"
        />
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
