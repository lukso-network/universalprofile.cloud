<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()

const handleNavigateSend = () => {
  navigateTo(sendRoute(connectedProfile.value?.address))
}
</script>

<template>
  <lukso-button
    variant="text"
    custom-class="text-12 nav-apax-12-medium-uppercase"
    class="group"
    @click="handleNavigateSend"
  >
    <span
      class="transition group-hover:text-purple-41"
      :class="{
        'text-purple-41': activePage('profileAddress-send'),
        'text-purple-63': !activePage('profileAddress-send'),
      }"
    >
      {{ $formatMessage('header_send') }}
    </span>
  </lukso-button>
</template>
