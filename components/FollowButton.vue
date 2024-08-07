<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'

type Props = {
  isFollowing?: boolean
  followerCount?: number | string
  followerAddresses?: Address[]
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const viewedProfile = useProfile().viewedProfile()
const connectedProfile = useProfile().connectedProfile()
const { follow, unfollow } = useFollowingSystem()
const isPending = ref(false)
const queryClient = useQueryClient()
const { selectedChainId: chainId } = useAppStore()

const isFollowingQueryKey = computed(() => [
  'isFollowing',
  viewedProfile.value?.address,
  connectedProfile.value?.address,
  chainId,
])

const followerCountKey = computed(() => [
  'followerCount',
  viewedProfile.value?.address,
  chainId,
])

const followerAddressesKey = computed(() => [
  'followerAddresses',
  viewedProfile.value?.address,
  chainId,
])

const updateAddFollowerQueries = () => {
  // optimistically update the cache
  queryClient.setQueryData(isFollowingQueryKey.value, true)
  queryClient.setQueryData(
    followerCountKey.value,
    getPositiveNumber(props.followerCount) + 1
  )
  queryClient.setQueryData(followerAddressesKey.value, [
    ...(props.followerAddresses || []),
    connectedProfile.value?.address,
  ])
}

const updateRemoveFollowerQueries = () => {
  // optimistically update the cache
  queryClient.setQueryData(isFollowingQueryKey.value, false)
  queryClient.setQueryData(
    followerCountKey.value,
    getPositiveNumber(props.followerCount) - 1
  )
  queryClient.setQueryData(followerAddressesKey.value, [
    ...(props.followerAddresses || []).filter(
      address => address !== connectedProfile.value?.address
    ),
  ])
}

const invalidateQueries = () => {
  // invalidate the cache to refetch the data
  queryClient.invalidateQueries({
    queryKey: isFollowingQueryKey.value,
  })
  queryClient.invalidateQueries({
    queryKey: followerCountKey.value,
  })
  queryClient.invalidateQueries({
    queryKey: followerAddressesKey.value,
  })
}

const handleFollow = async () => {
  // prevent multiple clicks when tx is pending
  if (isPending.value) {
    return
  }

  isPending.value = true
  updateAddFollowerQueries()
  await follow(viewedProfile.value?.address)
  isPending.value = false
  invalidateQueries()
}

const handleUnfollow = async () => {
  // prevent multiple clicks when tx is pending
  if (isPending.value) {
    return
  }

  isPending.value = true
  updateRemoveFollowerQueries()
  await unfollow(viewedProfile.value?.address)
  isPending.value = false
  invalidateQueries()
}
</script>

<template>
  <div class="group flex">
    <template v-if="isFollowing">
      <!-- Unfollow -->
      <lukso-button
        size="small"
        variant="secondary"
        class="hidden"
        :class="{
          'group-hover:block': !isPending,
        }"
        @click="handleUnfollow"
      >
        <lukso-icon
          name="profile-remove"
          size="small"
          class="mr-2"
        ></lukso-icon>
        {{ formatMessage('profile_card_unfollow_button') }}
      </lukso-button>

      <!-- Following -->
      <lukso-button
        size="small"
        variant="secondary"
        class="block"
        :class="{
          'group-hover:hidden': !isPending,
        }"
      >
        <lukso-icon name="profile" size="small" class="mr-2"></lukso-icon>
        {{ formatMessage('profile_card_following_button') }}
      </lukso-button>
    </template>
    <template v-else>
      <!-- Follow -->
      <lukso-button size="small" @click="handleFollow">
        <lukso-icon
          name="profile-add"
          size="small"
          color="neutral-100"
          class="mr-2"
        ></lukso-icon>
        {{ formatMessage('profile_card_follow_button') }}
      </lukso-button>
    </template>
  </div>
</template>
