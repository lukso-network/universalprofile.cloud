<script setup lang="ts">
type Props = {
  profileAddress?: Address
}

type Slots = {
  default(props: {
    profile: Profile | null
    profileAvatar: ImageItem | null
  }): any
}

const props = defineProps<Props>()
defineSlots<Slots>()

const address = computed(() => props.profileAddress)
const profile = useProfile().getProfile(address)
const profileAvatar = useProfileAvatar(profile, 24)
</script>

<template>
  <slot :profile="profile" :profile-avatar="profileAvatar" />
</template>
