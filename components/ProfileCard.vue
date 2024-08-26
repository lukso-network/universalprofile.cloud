<script setup lang="ts">
const viewedProfile = useProfile().viewedProfile()
const { isMobile } = useDevice()
const { showModal } = useModal()
const { isConnected } = storeToRefs(useAppStore())
const { formatMessage } = useIntl()
const connectedProfile = useProfile().connectedProfile()
const profileBackground = useProfileBackground(viewedProfile, 880)
const profileAvatar = useProfileAvatar(viewedProfile, 96)
const viewedProfileAddress = computed(() => viewedProfile.value?.address)
const viewedProfileFollowers = useFollowingSystem().getFollowersData(
  viewedProfileAddress.value
)
const connectedProfileFollowers = useFollowingSystem().getFollowersData(
  connectedProfile.value?.address
)

const handlePreviewProfileImage = () => {
  const image = viewedProfile.value?.profileImage

  if (!image) {
    return
  }

  showModal({
    template: 'AssetImage',
    data: {
      asset: image,
    },
    size: 'auto',
  })
}

const hasDescription = computed(
  () =>
    viewedProfile?.value?.description && viewedProfile.value.description !== ''
)

const hasTags = computed(
  () => viewedProfile?.value?.tags && viewedProfile.value.tags?.length > 0
)

const hasFollowButton = computed(
  () =>
    isConnected.value &&
    viewedProfile?.value?.address?.toLowerCase() !==
      connectedProfile?.value?.address?.toLowerCase()
)
</script>

<template>
  <div class="relative">
    <lukso-card
      variant="dapp"
      :background-url="profileBackground?.url"
      is-full-width
      shadow="small"
      :border-radius="isMobile ? 'none' : 'medium'"
      class="-mx-4 -mt-6 w-screen sm:mx-0 sm:mt-0 sm:w-full"
    >
      <div slot="header" class="relative flex size-full flex-col items-center">
        <ProfileCardShare :profile="viewedProfile" />
      </div>
      <div slot="content" class="relative flex flex-col p-4 pb-6 sm:p-8">
        <!-- Profile picture -->
        <div class="absolute top-[-60px]">
          <lukso-profile
            :profile-url="profileAvatar?.url"
            :profile-address="viewedProfile?.address"
            size="2x-large"
            has-identicon
            class="relative z-[1] cursor-pointer rounded-full outline outline-4 outline-neutral-100 transition hover:scale-[1.02]"
            @click="handlePreviewProfileImage"
          >
          </lukso-profile>
        </div>

        <div class="flex min-h-7 justify-end">
          <!-- Follow Button -->
          <FollowButton
            v-if="hasFollowButton"
            :is-following="viewedProfileFollowers?.isFollowing"
            :follower-count="viewedProfileFollowers?.followerCount"
            :follower-addresses="viewedProfileFollowers?.followerAddresses"
          />
        </div>

        <div
          class="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        >
          <!-- Profile Name -->
          <lukso-tooltip
            variant="light"
            offset="5"
            is-clipboard-copy
            :copy-text="formatMessage('profile_card_copy_address')"
            :copy-value="viewedProfile?.address"
          >
            <lukso-username
              v-if="viewedProfile?.name"
              :name="viewedProfile?.name.toLowerCase()"
              :address="viewedProfile?.address"
              address-color="neutral-80"
              size="x-large"
              max-width="350"
            ></lukso-username>
            <lukso-username
              v-else
              :name="formatMessage('profile_default_name')"
              :address="viewedProfile?.address"
              address-color="neutral-80"
              size="x-large"
              max-width="350"
              hide-prefix
            ></lukso-username>
          </lukso-tooltip>

          <!-- Follower counters -->
          <FollowCounters :profile-followers="viewedProfileFollowers" />
        </div>

        <!-- Followed by -->
        <FollowedBy
          v-if="hasFollowButton"
          :follower-addresses="viewedProfileFollowers?.followerAddresses"
          :following-addresses="connectedProfileFollowers?.followingAddresses"
          class="mt-4"
        />

        <!-- Description -->
        <div
          v-if="hasDescription"
          class="paragraph-inter-14-regular mt-4 whitespace-pre-line break-word"
        >
          {{ viewedProfile?.description }}
        </div>

        <!-- Tags -->
        <ul v-if="hasTags" class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          <li
            v-for="(tag, index) in viewedProfile?.tags"
            :key="index"
            class="inline-flex"
          >
            <lukso-tag is-rounded>{{ tag }}</lukso-tag>
          </li>
        </ul>

        <!-- Links -->
        <AppLinks
          v-if="viewedProfile?.links?.length"
          :links="viewedProfile?.links"
        >
          <template #default="{ socialMediaLinks, otherLinks }">
            <div class="flex flex-col gap-4">
              <ul
                v-if="socialMediaLinks.length > 0"
                class="mt-4 flex flex-wrap gap-2"
              >
                <li
                  v-for="(link, index) in socialMediaLinks"
                  :key="index"
                  class="inline-flex"
                >
                  <LinkButton
                    :link="link"
                    :size="isMobile ? 'medium' : 'small'"
                  />
                </li>
              </ul>
              <ul
                v-if="otherLinks.length > 0"
                class="flex flex-col flex-wrap gap-x-4 gap-y-2 sm:flex-row"
              >
                <li
                  v-for="(link, index) in otherLinks"
                  :key="index"
                  class="inline-flex"
                >
                  <LinkButton
                    :link="link"
                    :size="isMobile ? 'medium' : 'small'"
                  />
                </li>
              </ul>
            </div>
          </template>
        </AppLinks>
      </div>
    </lukso-card>
  </div>
</template>
