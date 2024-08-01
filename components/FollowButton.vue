<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'

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

const handleFollow = async () => {
  isPending.value = true
  // optimistically update the cache
  queryClient.setQueryData(isFollowingQueryKey.value, true)
  await follow(viewedProfile.value?.address)
  isPending.value = false
  // invalidate the cache to refetch the data
  queryClient.invalidateQueries({
    queryKey: isFollowingQueryKey.value,
  })
}

const handleUnfollow = async () => {
  isPending.value = true
  // optimistically update the cache
  queryClient.setQueryData(isFollowingQueryKey.value, false)
  await unfollow(viewedProfile.value?.address)
  isPending.value = false
  // invalidate the cache to refetch the data
  queryClient.invalidateQueries({
    queryKey: isFollowingQueryKey.value,
  })
}
</script>

<template>
  <div class="group flex">
    <template v-if="viewedProfile?.isFollowing">
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
