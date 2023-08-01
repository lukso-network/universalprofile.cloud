<script setup lang="ts">
// due to Nuxt SSR we need to check if window is defined
if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}
</script>

<template>
  <div>
    <lukso-button>Welcome!</lukso-button>
  </div>
</template>
