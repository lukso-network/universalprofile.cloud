<script setup lang="ts">
const { isDraft, isPending, isSuccess } = storeToRefs(useSendStore())
</script>

<template>
  <div class="mx-auto w-full max-w-[480px] px-4 text-center">
    <SendCardDraft v-if="isDraft" />
    <SendCardPending v-if="isPending" />
    <SendCardSuccess v-if="isSuccess" />
  </div>
</template>
