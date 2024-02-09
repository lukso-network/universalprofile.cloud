<script setup lang="ts">
type Props = {
  tokenSupply?: string
}

defineProps<Props>()
</script>

<template>
  <div class="paragraph-ptmono-14-regular" v-if="tokenSupply">
    {{
      $formatMessage('token_details_collection_of', {
        count: tokenSupply,
      })
    }}
  </div>
</template>
