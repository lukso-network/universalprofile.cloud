<script setup lang="ts">
type Props = {
  totalSupply?: string
}

defineProps<Props>()
</script>

<template>
  <div class="paragraph-ptmono-14-regular" v-if="totalSupply">
    {{
      $formatMessage('token_details_collection_of', {
        count: totalSupply,
      })
    }}
  </div>
</template>
