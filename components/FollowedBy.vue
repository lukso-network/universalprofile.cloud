<script setup lang="ts">
import { sliceAddress } from '@lukso/web-components/tools'

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
      if (profile?.name) {
        return `@${profile?.name}`
      }

      return sliceAddress(profile?.address, 4)
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
          <span v-else>
            {{
              formatMessage('followed_by_text', {
                names: profileNames(profiles),
                othersCount,
              })
            }}
          </span>
        </template>
      </LoaderProfiles>
    </div>
  </div>
</template>
