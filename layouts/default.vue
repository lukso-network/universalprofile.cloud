<script setup lang="ts">
onMounted(async () => {
  try {
    const profileAddress = useRouter().currentRoute.value.params?.profileAddress
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
