<script setup lang="ts">
type Props = {
  src?: string
}

const props = defineProps<Props>()
const { showModal } = useModal()

const handleClick = () => {
  if (!props.src) {
    return
  }

  showModal({
    template: 'AssetImage',
    data: {
      image: {
        url: props.src,
      },
    },
    size: 'auto',
  })
}
</script>

<template>
  <div class="m-3 flex h-full overflow-hidden rounded-8">
    <lukso-image
      :src="src"
      :class="{
        'cursor-pointer': !!src,
      }"
      class="min-h-full min-w-full"
      alt="image"
      @click="handleClick"
    ></lukso-image>
  </div>
</template>
