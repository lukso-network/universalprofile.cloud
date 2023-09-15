<script setup lang="ts">
onMounted(async () => {
  await setupViewedProfile()
  await setupViewedAssets()
})
</script>

<template>
  <div class="min-h-screen grid grid-rows-[max-content,auto,max-content]">
    <Navbar />
    <slot />
    <Footer />
  </div>
</template>
