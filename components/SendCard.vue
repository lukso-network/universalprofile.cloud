<script setup lang="ts">
const { isDraft, isPending, isSuccess } = storeToRefs(useSendStore())
</script>

<template>
  <div class="max-w-[480px] py-20 px-4 mx-auto w-full text-center">
    <SendCardDraft v-if="isDraft" />
    <SendCardPending v-if="isPending" />
    <SendCardSuccess v-if="isSuccess" />
  </div>
</template>
