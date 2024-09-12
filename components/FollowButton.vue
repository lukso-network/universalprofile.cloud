<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'

type Props = {
  address?: Address
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const connectedProfile = useProfile().connectedProfile()
const { follow, unfollow, isFollowing: isFollowingCheck } = useFollowingSystem()
const isPending = ref(false)
const queryClient = useQueryClient()
const { selectedChainId: chainId } = useAppStore()
const { isConnected, isMobile } = storeToRefs(useAppStore())
const { connect } = useBaseProvider()

const address = computed(() => props.address?.toLowerCase() as Address)
const profileFollowers = useFollowingSystem().getFollowersData(address)

const isFollowingQueryKey = computed(() => [
  'isFollowing',
  address.value,
  connectedProfile.value?.address?.toLowerCase(),
  chainId,
])

const followerCountKey = computed(() => [
  'followerCount',
  address.value,
  chainId,
])

const followerAddressesKey = computed(() => [
  'followerAddresses',
  address.value,
  chainId,
])

const hasFollowButton = computed(
  () =>
    address.value &&
    address.value !== connectedProfile?.value?.address?.toLowerCase()
)

const isLoading = computed(() => profileFollowers.value.isLoading)

const isFollowing = computed(() => profileFollowers.value.isFollowing)

const updateAddFollowerQueries = () => {
  // optimistically update the cache
  queryClient.setQueryData(isFollowingQueryKey.value, true)
  queryClient.setQueryData(
    followerCountKey.value,
    getPositiveNumber(profileFollowers.value.followerCount) + 1
  )
  queryClient.setQueryData(followerAddressesKey.value, [
    ...(profileFollowers.value.followerAddresses || []),
    connectedProfile.value?.address,
  ])
}

const updateRemoveFollowerQueries = () => {
  // optimistically update the cache
  queryClient.setQueryData(isFollowingQueryKey.value, false)
  queryClient.setQueryData(
    followerCountKey.value,
    getPositiveNumber(profileFollowers.value.followerCount) - 1
  )
  queryClient.setQueryData(followerAddressesKey.value, [
    ...(profileFollowers.value.followerAddresses || []).filter(
      address => address !== connectedProfile.value?.address
    ),
  ])
}

const invalidateQueries = () => {
  console.log('invalidateQueries')
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

const handleClick = async (event: Event) => {
  event.preventDefault()

  // when we are not connected, we need to connect first
  if (!isConnected.value) {
    await connect()
    invalidateQueries()

    // stop if we want to follow ourselves
    if (
      connectedProfile.value?.address?.toLowerCase() ===
      address.value.toLowerCase()
    ) {
      return
    }

    // check if we are already following
    isFollowingCheck(connectedProfile.value?.address, address.value)
      ?.call()
      .then((result: boolean) => {
        // we will only trigger follow after connecting
        if (!result) {
          handleFollow()
        }
      })
    return
  }

  // when we are connected we use standard flow
  if (isFollowing.value) {
    handleUnfollow()
  } else {
    handleFollow()
  }
}

const handleFollow = async () => {
  // prevent multiple clicks when tx is pending
  if (isPending.value) {
    return
  }

  isPending.value = true
  follow(address.value)
    ?.send({
      from: connectedProfile.value?.address,
    })
    ?.on('transactionHash', (_hash: string) => {
      updateAddFollowerQueries()
    })
    ?.on('receipt', (_receipt: any) => {
      isPending.value = false
      invalidateQueries()
    })
    ?.on('error', (error: Error) => {
      isPending.value = false
      invalidateQueries()
      console.error(error)
    })
}

const handleUnfollow = () => {
  // prevent multiple clicks when tx is pending
  if (isPending.value) {
    return
  }

  isPending.value = true
  unfollow(address.value)
    ?.send({
      from: connectedProfile.value?.address,
    })
    ?.on('transactionHash', (_hash: string) => {
      updateRemoveFollowerQueries()
    })
    ?.on('receipt', (_receipt: any) => {
      isPending.value = false
      invalidateQueries()
    })
    ?.on('error', (error: Error) => {
      isPending.value = false
      invalidateQueries()
      console.error(error)
    })
}
</script>

<template>
  <div v-if="hasFollowButton" class="group flex">
    <template v-if="isLoading">
      <AppPlaceholderLine
        class="h-12 w-[58px] !rounded-12 sm:h-[28px] sm:w-[86px] sm:!rounded-4"
      />
    </template>
    <template v-else-if="isFollowing">
      <!-- Unfollow -->
      <lukso-button
        :size="isMobile ? 'medium' : 'small'"
        variant="secondary"
        class="hidden"
        :class="{
          'group-hover:block': !isPending,
        }"
        :is-loading="isPending ? true : undefined"
        :loading-text="
          isMobile ? '' : formatMessage('profile_card_unfollow_button')
        "
        :is-icon="isMobile ? true : undefined"
        @click="handleClick"
      >
        <lukso-icon
          name="profile-remove"
          :size="isMobile ? 'medium' : 'small'"
          :class="{ 'mr-2': !isMobile }"
        ></lukso-icon>
        <span v-if="!isMobile">{{
          formatMessage('profile_card_unfollow_button')
        }}</span>
      </lukso-button>

      <!-- Following -->
      <lukso-button
        :size="isMobile ? 'medium' : 'small'"
        variant="secondary"
        class="block"
        :class="{
          'group-hover:hidden': !isPending,
        }"
        :is-loading="isPending ? true : undefined"
        :loading-text="
          isMobile ? '' : formatMessage('profile_card_following_button')
        "
        :is-icon="isMobile ? true : undefined"
      >
        <lukso-icon
          name="profile"
          :size="isMobile ? 'medium' : 'small'"
          :class="{ 'mr-2': !isMobile }"
        ></lukso-icon>
        <span v-if="!isMobile">
          {{ formatMessage('profile_card_following_button') }}
        </span>
      </lukso-button>
    </template>
    <template v-else>
      <!-- Follow -->
      <lukso-button
        :size="isMobile ? 'medium' : 'small'"
        :is-loading="isPending ? true : undefined"
        :loading-text="
          isMobile ? '' : formatMessage('profile_card_follow_button')
        "
        @click="handleClick"
        :is-icon="isMobile ? true : undefined"
      >
        <lukso-icon
          name="profile-add"
          :size="isMobile ? 'medium' : 'small'"
          color="neutral-100"
          :class="{ 'mr-2': !isMobile }"
        ></lukso-icon>
        <span v-if="!isMobile">
          {{ formatMessage('profile_card_follow_button') }}
        </span>
      </lukso-button>
    </template>
  </div>
</template>
