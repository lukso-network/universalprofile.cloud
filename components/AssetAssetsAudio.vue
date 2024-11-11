<script setup lang="ts">
type Props = {
  asset?: FileAsset
}

const props = defineProps<Props>()
const { showModal } = useModal()

const handleClick = () => {
  showModal({
    template: 'AssetAudio',
    data: {
      url: props.asset?.url,
    },
    size: 'auto',
  })
}
</script>

<template>
  <div
    class="paragraph-inter-10-bold-uppercase flex size-14 cursor-pointer flex-col items-center justify-center rounded-8 border border-neutral-90 bg-neutral-100 bg-cover transition hover:scale-[1.02] hover:border-transparent hover:shadow-neutral-shadow-round"
    @click="handleClick"
  >
    <lukso-icon name="headset-outline" class="mb-1"></lukso-icon>
    {{ $formatMessage('token_asset_type_music') }}
  </div>
</template>
