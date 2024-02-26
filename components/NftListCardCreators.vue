<script setup lang="ts">
type Props = {
  asset: TokenData
}

type VerifyStatus = 'verified' | 'unverified' | 'partial'

const props = defineProps<Props>()

const {
  firstCreator,
  restOfCreators,
  isPending,
  creatorAddressesOrOwner,
  isVerified,
} = useCreators(props.asset)

const verifyStatus = computed<VerifyStatus>(() => {
  const profileRepo = useRepo(ProfileRepository)
  const creators = creatorAddressesOrOwner.value?.map(creatorId =>
    profileRepo.getProfile(creatorId)
  )
  const verifiedCreators = creators?.filter(creator =>
    isVerified(creator)
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
  <div v-if="isPending" class="flex h-6 animate-pulse items-center">
    <lukso-profile size="x-small"></lukso-profile>
    <div class="grid h-full grid-rows-2 gap-1 pl-1">
      <div class="flex w-16 bg-neutral-90"></div>
      <div class="flex w-20 bg-neutral-90"></div>
    </div>
  </div>
  <!--no creators at all including owner, might be that its EOA or not indexed -->
  <div v-else-if="!firstCreator"></div>
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
