<script setup lang="ts">
const { modal, closeModal } = useModal()
const { formatMessage } = useIntl()
const { isMobile } = storeToRefs(useAppStore())
const perPage = computed(() => (isMobile.value ? 6 : 8))
const connectedProfile = useProfile().connectedProfile()
const viewedProfile = useProfile().viewedProfile()
const numberOfPages = computed(() =>
  Math.ceil((count.value || 0) / perPage.value)
)
const viewedProfileAddress = computed(() => viewedProfile.value?.address)
const viewedProfileFollowers = useFollowingSystem().getFollowersData(
  viewedProfileAddress.value
)

const viewProfileIsConnectedProfile = computed(
  () => connectedProfile?.value?.address === viewedProfile.value?.address
)

const addresses = computed(() =>
  isFollowingModal.value
    ? viewedProfileFollowers.value?.followingAddresses
    : viewedProfileFollowers.value?.followerAddresses
)

const count = computed(() =>
  isFollowingModal.value
    ? viewedProfileFollowers.value?.followingCount
    : viewedProfileFollowers.value?.followerCount
)

const hasFollowers = computed(() => (addresses.value?.length || 0) > 0)

const isFollowingModal = computed(() => modal?.data?.type === 'following')
</script>

<template>
  <div
    :class="{
      'sm:min-h-[730px]': numberOfPages > 1,
    }"
    class="relative grid w-full grid-rows-[max-content,auto,max-content] p-6 sm:w-[500px] sm:p-8"
  >
    <!-- Header -->
    <div class="heading-inter-21-semi-bold mb-6 flex items-center gap-2">
      {{ formatMessage(`modal_${modal?.data?.type}_title`) }}
      <div
        v-if="hasFollowers"
        class="paragraph-inter-12-bold inline-flex h-6 items-center rounded-4 border border-neutral-90 px-[6px]"
      >
        {{ count }}
      </div>
      <ModalCloseButton
        @click="closeModal"
        class="absolute right-6 top-6 sm:right-8 sm:top-8"
      />
    </div>

    <LoaderProfiles :profile-addresses="addresses">
      <template #default="{ profiles, isLoading }">
        <FollowList
          v-if="hasFollowers"
          :profiles="profiles"
          :addresses="addresses"
          :per-page="perPage"
          :is-loading="isLoading"
        />
      </template>
    </LoaderProfiles>

    <!-- Empty state -->
    <template v-if="!hasFollowers">
      <!-- Own followers text -->
      <span v-if="viewProfileIsConnectedProfile && !isFollowingModal">{{
        formatMessage('own_connected_profile_followers_empty')
      }}</span>

      <!-- Own following text -->
      <span v-if="viewProfileIsConnectedProfile && isFollowingModal">{{
        formatMessage('own_connected_profile_following_empty')
      }}</span>

      <!-- Other followers text -->
      <lukso-sanitize
        v-if="!viewProfileIsConnectedProfile && !isFollowingModal"
        :html-content="
          formatMessage('followed_by_empty', {
            username: `<lukso-username
                name='${viewedProfile?.name || formatMessage('profile_default_name')}'
                address='${viewedProfile?.address}'
                max-width='350'
                ${viewedProfile?.name ? '' : 'hide-prefix'}
              ></lukso-username>`,
          })
        "
      >
      </lukso-sanitize>

      <!-- Other following text -->
      <lukso-sanitize
        v-if="!viewProfileIsConnectedProfile && isFollowingModal"
        :html-content="
          formatMessage('follows_empty', {
            username: `<lukso-username
                name='${viewedProfile?.name || formatMessage('profile_default_name')}'
                address='${viewedProfile?.address}'
                max-width='350'
                ${viewedProfile?.name ? '' : 'hide-prefix'}
              ></lukso-username>`,
          })
        "
      >
      </lukso-sanitize>
    </template>
  </div>
</template>
