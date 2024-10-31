<script setup lang="ts">
const { showModal } = useModal()
const { formatMessage } = useIntl()

const handleAddContent = () => {
  showModal<Partial<GridWidget>>({
    template: 'AddGridWidget',
  })
}
</script>

<template>
  <div
    class="hover:shadow-neutral-shadow-round flex h-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-12 p-4 opacity-50 transition hover:opacity-100"
    :class="{ 'bg-dashed-border': true }"
    @click="handleAddContent"
  >
    <lukso-icon name="plus" size="large" color="neutral-20"></lukso-icon>
    <p class="mt-2">
      {{ formatMessage('grid_widget_add_widget_text') }}
    </p>
  </div>
</template>
