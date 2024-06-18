<script setup lang="ts">
type Props = {
  profile?: Profile
}

const props = defineProps<Props>()

const handleOpen = () => {
  window.open(universalSwapsProfileUrl(props.profile?.address), '_blank')
}
</script>

<template>
  <lukso-tooltip variant="white" text="universalswaps.io" placement="left">
    <lukso-button
      size="small"
      variant="secondary"
      custom-class="px-0 overflow-hidden size-full"
      class="group size-[30px]"
      @click="handleOpen"
    >
      <img
        src="/images/universalswaps-logo.png"
        alt=""
        class="max-h-4 max-w-[20px] grayscale transition group-hover:grayscale-0"
      />
    </lukso-button>
  </lukso-tooltip>
</template>
