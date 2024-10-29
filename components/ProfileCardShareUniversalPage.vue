<script setup lang="ts">
type Props = {
  profile?: Profile
}

const props = defineProps<Props>()

const handleOpen = () => {
  navigateTo(universalPageProfileUrl(props.profile?.address), {
    external: true,
    open: {
      target: '_blank',
    },
  })
}
</script>

<template>
  <lukso-tooltip variant="white" text="universal.page" placement="left">
    <lukso-button
      size="small"
      variant="secondary"
      custom-class="px-0 overflow-hidden size-full"
      class="group size-[30px]"
      @click="handleOpen"
    >
      <img
        src="/images/universalpage-logo.png"
        alt=""
        class="h-4 grayscale transition group-hover:grayscale-0"
      />
    </lukso-button>
  </lukso-tooltip>
</template>
