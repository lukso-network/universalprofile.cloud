<script setup lang="ts">
const { formatMessage, formatNumber } = useIntl()
const { showModal } = useModal()

type Props = {
  profileFollowers?: ProfileFollowers
}

const props = defineProps<Props>()

const handleShowFollowing = () => {
  showModal({
    template: 'Followers',
    data: {
      addresses: props.profileFollowers?.followingAddresses,
      count: props.profileFollowers?.followingCount,
      type: 'following',
    },
    size: 'medium',
  })
}

const handleShowFollowers = () => {
  showModal({
    template: 'Followers',
    data: {
      addresses: props.profileFollowers?.followerAddresses,
      count: props.profileFollowers?.followerCount,
      type: 'follower',
    },
    size: 'medium',
  })
}
</script>

<template>
  <AppPlaceholderLine
    v-if="profileFollowers?.isLoading"
    class="h-[20px] w-[160px]"
  />
  <div
    v-else
    class="paragraph-inter-12-medium group flex cursor-pointer items-center"
  >
    <div
      class="rounded-l-4 border border-neutral-90 px-1.5 transition hover:border-neutral-20 group-hover:border-r-neutral-20"
      @click="handleShowFollowing"
    >
      <span class="paragraph-inter-12-bold">{{
        formatNumber(profileFollowers?.followingCount || 0)
      }}</span>
      {{ formatMessage('profile_card_following') }}
    </div>
    <div
      class="rounded-r-4 border border-l-0 border-l-neutral-90 px-1.5 transition hover:border-neutral-20"
      @click="handleShowFollowers"
    >
      <span class="paragraph-inter-12-bold">{{
        formatNumber(profileFollowers?.followerCount || 0)
      }}</span>
      {{ formatMessage('profile_card_followers') }}
    </div>
  </div>
</template>
