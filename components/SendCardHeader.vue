<script setup lang="ts">
const { connectedProfile } = useConnectedProfile()
const { receiver } = storeToRefs(useSendStore())
</script>

<template>
  <div class="grid w-full grid-cols-[1fr,min-content,1fr]">
    <div class="flex flex-col items-center">
      <AppAvatar
        :profile="connectedProfile"
        :name="connectedProfile?.name"
        :address="connectedProfile?.address"
        :profile-url="connectedProfile?.profileImage?.url"
      />
    </div>
    <div class="flex items-center">
      <div class="z-[1] h-[92px] w-[20px] bg-neutral-100"></div>
      <div
        class="h-0 w-0 border-y-[46px] border-l-[16px] border-solid border-transparent border-l-neutral-100 drop-shadow-[8px_0_9px_rgba(118,109,158,0.5)]"
      ></div>
    </div>
    <div class="flex flex-col items-center">
      <AppAvatar
        :is-eoa="receiver?.type === 'EOA'"
        :name="receiver?.name"
        :address="receiver?.address"
        :profile-url="receiver?.profileImage?.url"
      />
    </div>
  </div>
</template>
