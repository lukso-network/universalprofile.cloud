<script setup lang="ts">
const { showModal } = useModal()
const { formatMessage } = useIntl()

const handleAddContent = () => {
  showModal({
    template: 'AddGridWidget',
    data: {
      type: undefined, // when no type we display selection screen
      width: 1,
      height: 1,
    },
  })
}
</script>

<template>
  <div
    class="flex h-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-12 p-4 opacity-50 transition hover:opacity-100 hover:shadow-neutral-drop-shadow"
    :class="{ 'bg-dashed-border': true }"
    @click="handleAddContent"
  >
    <lukso-icon name="plus" size="large" color="neutral-20"></lukso-icon>
    <p class="mt-2">
      {{ formatMessage('grid_widget_add_widget_text') }}
    </p>
  </div>
</template>
