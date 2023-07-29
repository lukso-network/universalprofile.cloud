<script setup lang="ts">
// due to Nuxt SSR we need to check if window is defined
if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

const { setupIntl } = useIntl()
setupIntl(defaultConfig)
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
