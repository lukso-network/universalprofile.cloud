<script setup lang="ts">
const { showModal } = useModal()
const { formatMessage } = useIntl()
const { clearWidgetData } = useWidgetStore()

const handleAddContent = () => {
  clearWidgetData()
  showModal({
    template: 'AddGridWidget',
  })
}
</script>

<template>
  <div
    class="flex h-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-12 p-4 transition hover:opacity-60 hover:shadow-neutral-drop-shadow"
    @click="handleAddContent"
  >
    <lukso-icon name="plus" size="large" />
    <p class="mt-2">{{ formatMessage('grid_widget_add_widget_text') }}</p>
  </div>
</template>
