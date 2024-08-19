<script setup lang="ts">
import '@google/model-viewer'

const { modal } = useAppStore()
const { formatMessage } = useIntl()
const { isMobile } = useDevice()

type Props = {
  closeModal: () => void
}

defineProps<Props>()
const perPage = isMobile ? 8 : 24
const connectedProfile = useProfile().connectedProfile()
const numberOfPages = computed(() => Math.ceil((count.value || 0) / perPage))

const currentPage = ref(1)

const addressesForPage = computed(() => {
  return addresses.value?.slice(
    (currentPage.value - 1) * perPage,
    perPage * currentPage.value
  )
})

const viewedProfileAddress = getCurrentProfileAddress()

const viewProfileIsConnectedProfile = computed(() => {
  return connectedProfile?.value?.address === viewedProfileAddress
})

const addresses = computed(() => modal?.data?.addresses as Address[])

const count = computed(() => modal?.data?.count as number)

const hasFollowers = computed(() => {
  return (addresses.value?.length || 0) > 0
})

const isFollowingModal = computed(() => {
  return modal?.data?.type === 'following'
})

const handleViewProfile = (profileAddress: Address) => {
  navigateTo(profileRoute(profileAddress))
}

const handlePageChange = (event: CustomEvent) => {
  currentPage.value = event.detail.value
}
</script>

<template>
  <div class="relative p-6 sm:p-8">
    <div class="heading-inter-21-semi-bold mb-6 flex items-center gap-2">
      {{ formatMessage(`modal_${modal?.data?.type}_title`) }}
      <div
        v-if="hasFollowers"
        class="paragraph-inter-12-bold inline-flex h-6 items-center rounded-4 border border-neutral-90 px-[6px]"
      >
        {{ count }}
      </div>
    </div>
    <ModalCloseButton
      @click="closeModal"
      class="absolute right-6 top-6 sm:right-8 sm:top-8"
    />

    <!-- List of profiles -->

    <div class="grid gap-6 sm:grid-cols-3">
      <LoaderProfile
        v-for="profileAddress in addressesForPage"
        :key="profileAddress"
        :profile-address="profileAddress"
      >
        <template #default="{ profile, profileAvatar }">
          <div
            @click="handleViewProfile(profileAddress)"
            class="flex cursor-pointer items-center gap-4"
          >
            <template v-if="profile.isLoading">
              <AppPlaceholderCircle class="size-10" />
              <AppPlaceholderLine class="h-[22px] w-3/5" />
            </template>
            <template v-else>
              <lukso-profile
                size="small"
                :profile-url="profileAvatar?.url"
                :profile-address="profile?.address"
                has-identicon
              ></lukso-profile>
              <lukso-username
                :name="profile.name"
                :address="profile.address"
                address-color="neutral-80"
              >
              </lukso-username>
            </template>
          </div>
        </template>
      </LoaderProfile>
    </div>

    <!-- Pagination -->
    <div v-if="numberOfPages > 1" class="mt-6 flex justify-center">
      <lukso-pagination
        variant="secondary"
        :current-page="currentPage"
        :total-pages="numberOfPages"
        @on-page-change="handlePageChange"
      ></lukso-pagination>
    </div>

    <!-- Empty state -->
    <template v-if="!hasFollowers">
      <LoaderProfile :profile-address="viewedProfileAddress">
        <template #default="{ profile }">
          <span v-if="viewProfileIsConnectedProfile && !isFollowingModal">{{
            formatMessage('own_connected_profile_followers_empty')
          }}</span>
          <span v-if="viewProfileIsConnectedProfile && isFollowingModal">{{
            formatMessage('own_connected_profile_following_empty')
          }}</span>
          <span v-if="!viewProfileIsConnectedProfile && !isFollowingModal">{{
            formatMessage('followed_by_empty', {
              username: profile.name,
            })
          }}</span>
          <span v-if="!viewProfileIsConnectedProfile && isFollowingModal">{{
            formatMessage('follows_empty', {
              username: profile.name,
            })
          }}</span>
        </template>
      </LoaderProfile>
    </template>
  </div>
</template>
