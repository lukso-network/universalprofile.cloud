<script setup lang="ts">
type Props = {
  followerAddresses?: Address[]
  followingAddresses?: Address[]
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()

const followers = computed(() => {
  return (
    props.followerAddresses?.filter(address =>
      props.followingAddresses?.includes(address)
    ) || []
  )
})

const restOfFollowers = computed(() => {
  return followers.value.slice(1, 3)
})

const addressesForFollowerNames = computed(() => {
  return followers.value.slice(0, 2)
})

const othersCount = computed(() => {
  return (
    followers.value.length >= 2 ? followers.value.length - 2 : 0
  ).toString()
})

const profileNames = (profiles?: Profile[]) =>
  profiles
    ?.map((profile: Profile) => {
      return `<lukso-username
        name='${profile?.name || formatMessage('profile_default_name')}'
        address='${profile.address}'
        size='small'
        address-color='neutral-20'
        name-color='neutral-20'
        ${profile?.name ? '' : 'hide-prefix'}
      ></lukso-username>`
    })
    .join(', ') || ''
</script>

<template>
  <div v-if="followers.length > 0" class="flex items-center">
    <div class="flex space-x-[-14px]">
      <LoaderProfile
        v-for="(followerAddress, index) in restOfFollowers || []"
        :profile-address="followerAddress"
        :key="index"
      >
        <template #default="{ profile, profileAvatar }">
          <lukso-profile
            size="x-small"
            :profile-url="profileAvatar?.url"
            :profile-address="profile?.address"
          ></lukso-profile>
        </template>
      </LoaderProfile>
      <LoaderProfile v-if="followers[0]" :profile-address="followers[0]">
        <template #default="{ profile, profileAvatar }">
          <lukso-profile
            size="x-small"
            :profile-url="profileAvatar?.url"
            :profile-address="profile?.address"
          ></lukso-profile>
        </template>
      </LoaderProfile>
    </div>
    <div class="paragraph-inter-12-medium pl-2">
      <LoaderProfiles :profile-addresses="addressesForFollowerNames">
        <template #default="{ profiles, isLoading }">
          <AppPlaceholderLine v-if="isLoading" class="h-[15px] w-[200px]" />
          <lukso-sanitize
            v-else
            :html-content="
              formatMessage('followed_by_text', {
                names: profileNames(profiles),
                othersCount,
              })
            "
          >
          </lukso-sanitize>
        </template>
      </LoaderProfiles>
    </div>
  </div>
</template>
