<script setup lang="ts">
const { isOwned, setFilters, filters } = useFilters()
const viewedProfileAddress = getCurrentProfileAddress()
const viewedProfile = useProfile().getProfile(viewedProfileAddress)
const assetsData = useProfileAssets()(viewedProfileAddress)
const assets = computed(() => assetsData.value || [])
const isLoadingAssets = computed(() =>
  assets.value.some(asset => asset.isLoading)
)
const { gridsForDisplay } = useGrid()

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

const handleTabChange = (tab: ProfileViewTab) => {
  setFilters({ assetGroup: tab.id }, undefined, true)
}

const tabs = computed<ProfileViewTab[]>(() => {
  return [
    {
      id: 'grid',
      count:
        gridsForDisplay.value.length > 1 ? gridsForDisplay.value.length : 0,
    },
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

const activeTab = computed(() => {
  return filters.assetGroup
})
</script>

<template>
  <AppPageLoader :is-loading="viewedProfile?.isLoading">
    <div
      v-if="viewedProfile?.standard === STANDARDS.LSP3"
      class="mx-auto max-w-content"
    >
      <ProfileCard />
      <div
        v-if="createdCollectiblesCount > 0"
        class="heading-inter-17-semi-bold my-10 flex items-center justify-center sm:mt-20"
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
          :active-tab="activeTab"
          :tabs="tabs"
          @activate-tab="handleTabChange"
          class="mt-20"
        />
        <GridView
          :class="{
            'visible relative z-10 opacity-100': activeTab === 'grid',
            'invisible absolute z-0 opacity-0': activeTab !== 'grid',
          }"
        />
        <ProfileAssets
          v-show="activeTab !== 'grid'"
          :assets="filteredAssets"
          :is-loading="isLoadingAssets"
          class="relative z-10"
        />
      </div>
    </div>
    <ProfileViewNotUp v-else :address="viewedProfile?.address" />
  </AppPageLoader>
</template>
