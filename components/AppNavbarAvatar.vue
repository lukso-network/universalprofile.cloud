<script setup lang="ts">
import type { ProfileSize } from '@lukso/web-components'

type Props = {
  size?: ProfileSize
}

withDefaults(defineProps<Props>(), {
  size: 'small',
})
const connectedProfile = useProfile().connectedProfile()
const avatarImage = useProfileAvatar(connectedProfile, 40)
</script>

<template>
  <lukso-profile
    :size="size"
    :profile-url="avatarImage?.url"
    :profile-address="connectedProfile?.address"
    :data-profile-address="connectedProfile?.address"
    has-identicon
  ></lukso-profile>
</template>
