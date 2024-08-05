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
</script>

<template>
  <div v-if="followers.length > 0" class="flex items-center">
    <div class="flex space-x-[-14px]">
      <FollowedByItem
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
      </FollowedByItem>
      <FollowedByItem v-if="followers[0]" :profile-address="followers[0]">
        <template #default="{ profile, profileAvatar }">
          <lukso-profile
            size="x-small"
            :profile-url="profileAvatar?.url"
            :profile-address="profile?.address"
          ></lukso-profile>
        </template>
      </FollowedByItem>
    </div>
    <div class="paragraph-inter-12-medium pl-2">
      <FollowedByNames :profile-addresses="addressesForFollowerNames">
        <template #default="{ names, isLoading }">
          <AppPlaceholderLine v-if="isLoading" class="h-[15px] w-[200px]" />
          <span v-else>
            {{ formatMessage('followed_by_text', { names, othersCount }) }}
          </span>
        </template>
      </FollowedByNames>
    </div>
  </div>
</template>
