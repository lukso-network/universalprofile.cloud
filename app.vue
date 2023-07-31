<script setup lang="ts">
import { getProfileAddressFromUrl } from '@/utils/getProfileAddressFromUrl'

// due to Nuxt SSR we need to check if window is defined
if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

// setup translations
const { setupIntl } = useIntl()
setupIntl(defaultConfig)

// get profile address from url with additional validation checks
getProfileAddressFromUrl()
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
