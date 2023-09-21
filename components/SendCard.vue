<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { isDraft, isPending, isSuccess } = storeToRefs(useSendStore())
</script>

<template>
  <div class="max-w-[480px] py-20 px-4 mx-auto w-full">
    <SendCardDraft v-if="isDraft" />
    <SendCardPending v-if="isPending" />
    <SendCardSuccess v-if="isSuccess" />
  </div>
</template>
