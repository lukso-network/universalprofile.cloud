<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { profile: connectedProfile } = useConnectedProfileStore()
const { receiver } = storeToRefs(useSendStore())
</script>

<template>
  <div class="grid grid-cols-[1fr,min-content,1fr] w-full">
    <div class="flex flex-col items-center">
      <AppAvatar
        :address="connectedProfile.address"
        :profile="connectedProfile"
      />
    </div>
    <div class="flex items-center">
      <div class="w-[20px] h-[92px] bg-neutral-100 z-[1]"></div>
      <div
        class="w-0 h-0 border-t-[46px] border-b-[46px] border-l-[16px] border-transparent border-l-neutral-100 border-solid drop-shadow-[8px_0_9px_rgba(118,109,158,0.5)]"
      ></div>
    </div>
    <div class="flex flex-col items-center">
      <AppAvatar
        :address="receiver?.address"
        :profile="receiver"
        :is-eoa="receiver?.isEoa"
      />
    </div>
  </div>
</template>
