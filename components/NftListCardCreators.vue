<script setup lang="ts">
type Props = {
  asset: Asset
}

type VerifyStatus = 'verified' | 'unverified' | 'partial'

const props = defineProps<Props>()

const creatorAddressesOrOwner = computed(() => {
  // if no creators we use contract owner
  if (!!!props.asset?.creators?.length && props.asset?.contractOwner) {
    return [props.asset?.contractOwner]
  }

  return props.asset?.creators?.filter(Boolean) || []
})

const creatorQueries = useQueries({
  queries:
    creatorAddressesOrOwner.value.map(creatorAddress => ({
      queryKey: ['profile', creatorAddress],
      queryFn: () => fetchAndStoreProfile(creatorAddress),
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

const firstCreator = computed(() => {
  return creatorQueries.value.data?.[0]
})

const restOfCreators = computed(() => creatorQueries.value.data?.slice(1) || [])

const verifyStatus = computed<VerifyStatus>(() => {
  const profileRepo = useRepo(ProfileRepository)
  const creators = props.asset?.creators?.map(creatorId =>
    profileRepo.getProfile(creatorId)
  )
  const verifiedCreators = creators?.filter(
    creator =>
      props.asset?.address &&
      creator?.issuedAssetAddresses?.includes(props.asset?.address)
  ).length

  if (verifiedCreators === 0) {
    return 'unverified'
  }

  if (verifiedCreators === creators?.length) {
    return 'verified'
  }

  return 'partial'
})
</script>

<template>
  <div
    v-if="creatorQueries.isPending"
    class="flex h-6 animate-pulse items-center"
  >
    <lukso-profile size="x-small"></lukso-profile>
    <div class="grid h-full grid-rows-2 gap-1 pl-1">
      <div class="flex w-16 bg-neutral-90"></div>
      <div class="flex w-20 bg-neutral-90"></div>
    </div>
  </div>
  <div v-else class="grid animate-fade-in grid-cols-[max-content,auto]">
    <div class="flex space-x-[-14px]">
      <NftListCardCreatorsProfile
        v-for="(creatorProfile, index) in restOfCreators"
        :profile="creatorProfile"
        :key="index"
        class="relative"
      />
      <NftListCardCreatorsProfile
        v-if="firstCreator"
        :profile="firstCreator"
        class="relative"
        :has-name="true"
      />
    </div>
    <div class="flex items-center justify-end">
      <lukso-tooltip
        v-if="verifyStatus === 'unverified'"
        variant="danger"
        :text="$formatMessage('asset_all_creators_unverified')"
        class="ml-2"
      >
        <lukso-icon
          name="cross-filled"
          color="red-55"
          secondary-color="neutral-100"
          size="small"
        ></lukso-icon>
      </lukso-tooltip>
      <lukso-tooltip
        v-if="verifyStatus === 'partial'"
        variant="danger"
        :text="$formatMessage('asset_all_creators_partial')"
        class="ml-2"
      >
        <lukso-icon
          name="cross-filled"
          color="red-55"
          secondary-color="neutral-100"
          size="small"
        ></lukso-icon>
      </lukso-tooltip>
      <lukso-tooltip
        v-if="verifyStatus === 'verified'"
        variant="success"
        :text="$formatMessage('asset_all_creators_verified')"
        class="ml-2"
      >
        <lukso-icon
          name="complete-filled"
          color="green-54"
          secondary-color="neutral-100"
          size="small"
        ></lukso-icon>
      </lukso-tooltip>
    </div>
  </div>
</template>
