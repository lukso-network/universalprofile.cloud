<script setup lang="ts">
type Props = {
  asset: Asset
}

const props = defineProps<Props>()

const creatorAddressesOrOwner = computed(() => {
  const { creators, contractOwner } = props.asset || {}

  // if no creators we use contract owner
  if (!!!creators?.length && contractOwner) {
    return [contractOwner]
  }

  return creators?.filter(Boolean) || []
})

const creatorQueries = useQueries({
  queries:
    creatorAddressesOrOwner.value.map(creatorAddress => ({
      queryKey: ['profile', creatorAddress],
      queryFn: async () => await fetchAndStoreProfile(creatorAddress),
    })) || [],
  combine: results => {
    return {
      data: results.map(result => result.data),
      isPending: results.some(result => {
        return result.isPending
      }),
    }
  },
})

const creatorProfiles = computed(
  () => creatorQueries.value.data.filter(Boolean) || []
)

const isVerified = (creatorProfile?: Profile) =>
  props.asset?.address &&
  creatorProfile?.issuedAssetAddresses?.includes(props.asset?.address)

const handleOpenProfile = (address?: Address) => {
  if (address) {
    navigateTo(profileRoute(address))
    fetchAndStoreAssets(address)
  }
}
</script>

<template>
  <div v-if="creatorQueries.isPending" class="animate-pulse">
    <div class="mb-2 h-4 w-20 rounded-4 bg-neutral-90"></div>
    <div class="mb-8 h-12 w-52 rounded-12 bg-neutral-90"></div>
  </div>
  <div v-else-if="!creatorProfiles.length"></div>
  <div v-else>
    <div class="heading-inter-14-bold pb-2">
      {{ $formatMessage('asset_creators_title') }}
    </div>
    <div class="mb-8 flex flex-wrap gap-2">
      <lukso-button
        v-for="(creatorProfile, index) in creatorProfiles"
        :key="index"
        custom-class="px-4"
        variant="secondary"
        @click="handleOpenProfile(creatorProfile?.address)"
      >
        <lukso-profile
          size="x-small"
          :profile-url="creatorProfile?.profileImage?.url"
          :profile-address="creatorProfile?.address"
          has-identicon
        ></lukso-profile>
        <lukso-username
          :name="creatorProfile?.name"
          :address="creatorProfile?.address"
          size="small"
          class="pl-2"
          name-color="neutral-20"
        ></lukso-username>
        <lukso-tooltip
          v-if="isVerified(creatorProfile)"
          variant="success"
          :text="$formatMessage('asset_creators_verified')"
          class="ml-2"
        >
          <lukso-icon
            name="complete-filled"
            color="green-54"
            secondary-color="neutral-100"
            size="small"
          ></lukso-icon>
        </lukso-tooltip>
        <lukso-tooltip
          v-else
          variant="danger"
          :text="$formatMessage('asset_creators_unverified')"
          class="ml-2"
        >
          <lukso-icon
            name="cross-filled"
            color="red-55"
            secondary-color="neutral-100"
            size="small"
          ></lukso-icon>
        </lukso-tooltip>
      </lukso-button>
    </div>
  </div>
</template>
