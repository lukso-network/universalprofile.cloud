<script setup lang="ts">
type Props = {
  asset: TokenData
}

// type VerifyStatus = 'verified' | 'unverified' | 'partial'

const props = defineProps<Props>()
const creators = computed(() => {
  return (props.asset?.tokenCreators || []) as Address[]
})

// const {
//   firstCreator,
//   restOfCreators,
//   isPending,
//   creatorAddressesOrOwner,
//   isVerified,
// } = useCreators(props.asset)

// const verifyStatus = computed<VerifyStatus>(() => {
//   const profileRepo = useRepo(ProfileRepository)
//   const creators = creatorAddressesOrOwner.value?.map(creatorId =>
//     profileRepo.getProfile(creatorId)
//   )
//   const verifiedCreators = creators?.filter(creator =>
//     isVerified(creator)
//   ).length

//   if (verifiedCreators === 0) {
//     return 'unverified'
//   }

//   if (verifiedCreators === creators?.length) {
//     return 'verified'
//   }

//   return 'partial'
// })
</script>

<template>
  <!--no creators at all including owner, might be that its EOA or not indexed -->
  <div v-if="(creators || []).length === 0"></div>
  <div v-else class="grid animate-fade-in grid-cols-[max-content,auto]">
    <div class="flex space-x-[-14px]">
      <NftListCardCreatorsProfile
        v-for="(creatorAddress, index) in (creators || []).slice(1)"
        :profile="creatorAddress"
        :asset="asset.address"
        :key="index"
        class="relative"
      />
      <NftListCardCreatorsProfile
        v-if="creators[0]"
        :profile="creators[0]"
        :asset="asset.address"
        class="relative"
        has-name
      />
    </div>
    <div class="flex items-center justify-end">
      <!-- NEED to setup publishing the verified result back from
        the list of NftListCardCreatorsProfile
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
      </lukso-tooltip> -->
    </div>
  </div>
</template>
