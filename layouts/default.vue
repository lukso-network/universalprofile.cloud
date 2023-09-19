<script setup lang="ts">
import { isAddress } from 'web3-utils'

onMounted(async () => {
  try {
    const profileAddress = useRouter().currentRoute.value.params?.profileAddress

    if (!isAddress(profileAddress)) {
      navigateTo(notFoundRoute())
    }

    await setupViewedProfile(profileAddress)
    await setupViewedAssets(profileAddress)
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="min-h-screen grid grid-rows-[max-content,auto,max-content]">
    <AppNavbar />
    <slot />
    <AppFooter />
  </div>
</template>
