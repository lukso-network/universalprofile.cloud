<script setup lang="ts">
import { fetchProfileAddressFromUrl } from '@/utils/fetchProfileAddressFromUrl'

if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

// setup translations
const { setupIntl } = useIntl()
setupIntl(defaultConfig)

try {
  fetchProfileAddressFromUrl()
} catch (error) {
  console.error(error)
}
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
