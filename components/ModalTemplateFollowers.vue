<script setup lang="ts">
import '@google/model-viewer'

const { modal } = useAppStore()
const { formatMessage } = useIntl()
const { isMobile } = useDevice()

type Props = {
  closeModal: () => void
}

const props = defineProps<Props>()
const perPage = isMobile ? 8 : 24
const connectedProfile = useProfile().connectedProfile()
const viewedProfile = useProfile().viewedProfile()
const numberOfPages = computed(() => Math.ceil((count.value || 0) / perPage))
const viewedProfileAddress = computed(() => viewedProfile.value?.address)
const viewedProfileFollowers = useFollowingSystem().getFollowersData(
  viewedProfileAddress.value
)

const currentPage = ref(1)

const addressesForPage = computed(() => {
  return addresses.value?.slice(
    (currentPage.value - 1) * perPage,
    perPage * currentPage.value
  )
})

const viewProfileIsConnectedProfile = computed(() => {
  return connectedProfile?.value?.address === viewedProfile.value?.address
})

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

const hasFollowers = computed(() => {
  return (addresses.value?.length || 0) > 0
})

const isFollowingModal = computed(() => {
  return modal?.data?.type === 'following'
})

const handleViewProfile = async (profileAddress: Address) => {
  await navigateTo(profileRoute(profileAddress))
  props.closeModal()
}

const handlePageChange = (event: CustomEvent) => {
  currentPage.value = event.detail.value
}
</script>

<template>
  <div
    :class="{
      'sm:min-h-[654px]': numberOfPages > 1,
    }"
    class="relative grid grid-rows-[max-content,auto,max-content] p-6 sm:p-8"
  >
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

    <div v-if="hasFollowers" class="flex flex-col justify-between">
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
                  :name="profile.name || formatMessage('profile_default_name')"
                  :address="profile.address"
                  address-color="neutral-80"
                  :hide-prefix="!profile.name ? true : undefined"
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
    </div>

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
