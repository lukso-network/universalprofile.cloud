<script setup lang="ts">
const { formatMessage, formatNumber } = useIntl()
const { showModal } = useModal()
const { isMobile } = storeToRefs(useAppStore())

type Props = {
  profileFollowers?: ProfileFollowers
}

defineProps<Props>()

const handleShowFollowing = () => {
  showModal({
    template: 'Followers',
    data: {
      type: 'following',
    },
    size: isMobile.value ? 'full' : 'auto',
    isUrlModal: true,
  })
}

const handleShowFollowers = () => {
  showModal({
    template: 'Followers',
    data: {
      type: 'follower',
    },
    size: isMobile.value ? 'full' : 'auto',
    isUrlModal: true,
  })
}
</script>

<template>
  <AppPlaceholderLine
    v-if="profileFollowers?.isLoadingCounters"
    class="h-[20px] w-[160px]"
  />
  <div
    v-else
    class="paragraph-inter-12-medium group flex cursor-pointer items-center"
  >
    <div
      class="rounded-l-4 border border-neutral-90 px-3 py-1 transition hover:border-neutral-20 group-hover:border-r-neutral-20 sm:px-1.5 sm:py-0"
      @click="handleShowFollowing"
    >
      <span class="paragraph-inter-12-bold">{{
        formatNumber(profileFollowers?.followingCount || 0)
      }}</span>
      {{ formatMessage('profile_card_following') }}
    </div>
    <div
      class="rounded-r-4 border border-l-0 border-l-neutral-90 px-3 py-1 transition hover:border-neutral-20 sm:px-1.5 sm:py-0"
      @click="handleShowFollowers"
    >
      <span class="paragraph-inter-12-bold">{{
        formatNumber(profileFollowers?.followerCount || 0)
      }}</span>
      {{ formatMessage('profile_card_followers') }}
    </div>
  </div>
</template>
