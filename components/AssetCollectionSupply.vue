<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isLoading)
const totalSupply = computed(() => props.asset?.totalSupply)
</script>

<template>
  <template v-if="isLoaded">
    <div class="paragraph-ptmono-14-regular" v-if="totalSupply">
      {{
        $formatMessage('token_details_collection_of', {
          count: totalSupply,
        })
      }}
    </div>
  </template>
  <AppPlaceholderLine v-else class="h-[20px] w-1/3" />
</template>
