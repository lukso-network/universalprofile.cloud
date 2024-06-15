<script setup lang="ts">
type Props = {
  profile?: Profile
}

defineProps<Props>()
</script>

<template>
  <div class="absolute right-4 top-4 flex flex-col items-end gap-2">
    <ProfileCardShareLink :profile="profile" />
    <ProfileCardShareUniversalPage :profile="profile" />
    <ProfileCardShareUniversalSwaps :profile="profile" />
  </div>
</template>
