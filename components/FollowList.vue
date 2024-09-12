<script setup lang="ts">
type Props = {
  profiles: Profile[]
  addresses: Address[]
  perPage: number
  isLoading?: boolean
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const { isMobile } = storeToRefs(useAppStore())
const search = ref<string>()
const currentPage = ref(1)

const count = computed(() => filteredAddresses.value.length)
const numberOfPages = computed(() =>
  Math.ceil((count.value || 0) / props.perPage)
)

const filteredAddresses = computed(() => {
  if (search.value) {
    return (
      props.profiles
        .filter(
          profile =>
            profile.name
              ?.toLowerCase()
              .includes(search.value?.toLowerCase() || '') ||
            profile.address
              ?.toLowerCase()
              .includes(search.value?.toLowerCase() || '')
        )
        .map(profile => profile.address as Address) || []
    )
  }

  return props.addresses
})

const addressesForPage = computed(() => {
  return filteredAddresses.value?.slice(
    (currentPage.value - 1) * props.perPage,
    props.perPage * currentPage.value
  )
})

const handlePageChange = (event: CustomEvent) => {
  currentPage.value = event.detail.value
}

const handleChangeSearch = (event: CustomEvent) => {
  search.value = event.detail?.value
  currentPage.value = 1
}

const handleResetSearch = () => {
  search.value = undefined
}
</script>

<template>
  <div class="grid grid-rows-[max-content,auto]">
    <!-- Search -->
    <lukso-search
      .value="search"
      placeholder="Search for a profile"
      is-full-width
      hide-loading
      has-reset
      class="mb-6"
      @on-search="handleChangeSearch"
      @on-reset="handleResetSearch"
    ></lukso-search>

    <div class="flex flex-col justify-between">
      <!-- List of profiles -->

      <div class="grid grid-cols-1 gap-6">
        <LoaderProfile
          v-for="profileAddress in addressesForPage"
          :key="profileAddress"
          :profile-address="profileAddress"
        >
          <template #default="{ profile, profileAvatar }">
            <NuxtLink
              class="grid cursor-pointer grid-cols-[max-content,max-content,auto] items-center gap-4"
              :class="{
                'min-h-12': isMobile,
              }"
              :to="profileRoute(profileAddress)"
            >
              <template v-if="profile.isLoading">
                <AppPlaceholderCircle class="size-10" />
                <AppPlaceholderLine class="h-[22px] w-[150px] sm:w-[200px]" />
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
                  :max-width="isMobile ? '150' : '200'"
                  :hide-prefix="!profile.name ? true : undefined"
                >
                </lukso-username>
              </template>
              <div class="flex justify-end">
                <AppPlaceholderLine
                  v-show="profile.isLoading"
                  class="h-12 w-[58px] !rounded-12 sm:h-[28px] sm:w-[86px] sm:!rounded-4"
                />
                <FollowButton
                  v-show="!profile.isLoading"
                  :address="profileAddress"
                />
              </div>
            </NuxtLink>
          </template>
        </LoaderProfile>

        <!-- Empty state -->
        <div v-if="addressesForPage.length === 0">
          {{ formatMessage('profile_search_no_results') }}
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="numberOfPages > 1" class="mt-6 flex justify-center">
        <lukso-pagination
          variant="secondary"
          :size="isMobile ? 'medium' : 'small'"
          :is-mobile="isMobile ? true : undefined"
          :current-page="currentPage"
          :total-pages="numberOfPages"
          @on-page-change="handlePageChange"
        ></lukso-pagination>
      </div>
    </div>
  </div>
</template>
