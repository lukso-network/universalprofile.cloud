<script setup lang="ts">
type Props = {
  asset?: Image
}

const props = defineProps<Props>()
const { showModal } = useModal()

const handleClick = () => {
  if (!props.asset) {
    return
  }

  const optimizedImage = useOptimizedImage([props.asset], 1000)
  showModal({
    template: 'AssetImage',
    data: {
      image: unref(optimizedImage),
    },
    size: 'auto',
    isUrlModal: true,
  })
}
</script>

<template>
  <div
    class="paragraph-inter-10-bold-uppercase flex size-14 cursor-pointer flex-col items-center justify-center rounded-8 border border-neutral-90 bg-neutral-100 bg-cover transition hover:scale-[1.02] hover:shadow-neutral-drop-shadow"
    @click="handleClick"
  >
    <lukso-icon name="camera" class="mb-1"></lukso-icon>
    {{ $formatMessage('token_asset_type_image') }}
  </div>
</template>
