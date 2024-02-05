<script setup lang="ts">
import type { Creator } from '@/models/creator'

type Props = {
  creators?: Creator[]
}

type VerifyStatus = 'verified' | 'unverified' | 'partial'

const props = defineProps<Props>()
const profile: Profile = {}

const firstCreator = computed(
  () => useProfile(props.creators?.[0]?.profileId).profile
)

const restOfCreators = computed(() =>
  props.creators
    ?.slice(1)
    .map(creator => useProfile(creator?.profileId).profile)
)

const verifyStatus = computed<VerifyStatus>(() => {
  if (props.creators?.filter(creator => creator?.isVerified).length === 0)
    return 'unverified'
  if (
    props.creators?.filter(creator => creator?.isVerified).length ===
    props.creators?.length
  )
    return 'verified'
  return 'partial'
})
</script>

<template>
  <div
    v-if="creators?.length && profile"
    class="grid grid-cols-[max-content,max-content,auto]"
  >
    <div class="flex space-x-[-14px]">
      <lukso-profile
        v-for="creator in restOfCreators"
        :key="creator?.value?.address"
        size="x-small"
        :profile-url="creator.value?.profileImage?.url"
        class="relative"
      ></lukso-profile>
      <lukso-profile
        size="x-small"
        :profile-url="firstCreator.value?.profileImage?.url"
        :profile-address="firstCreator.value?.address"
        has-identicon
        class="relative"
      ></lukso-profile>
    </div>
    <div class="pl-1">
      <div class="paragraph-inter-10-semi-bold text-neutral-60">
        {{ $formatMessage('asset_created_by') }}
      </div>
      <lukso-username
        :name="firstCreator.value?.name"
        :address="firstCreator.value?.address"
        size="x-small"
        class="flex"
        name-color="neutral-20"
      ></lukso-username>
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
