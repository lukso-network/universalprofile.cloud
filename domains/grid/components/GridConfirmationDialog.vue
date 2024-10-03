<script setup lang="ts">
type Emits = {
  (event: 'cancel'): void
  (event: 'save'): void
}

const emits = defineEmits<Emits>()
const { hasUnsavedGrid, isSavingGrid } = storeToRefs(useAppStore())
const { formatMessage } = useIntl()
</script>

<template>
  <div
    v-if="hasUnsavedGrid"
    class="paragraph-inter-12-regular fixed bottom-4 grid w-[calc(100%-32px)] grid-cols-[auto,max-content] items-center justify-between gap-4 rounded-8 border-[3px] border-yellow-55 bg-neutral-100 p-4 sm:bottom-10 sm:left-[calc(50%-250px)] sm:w-[500px]"
  >
    {{ formatMessage('grid_unsaved_changes_text') }}
    <div class="flex items-center">
      <lukso-button
        size="small"
        variant="text"
        :disabled="isSavingGrid ? true : undefined"
        @click="emits('cancel')"
        >{{ formatMessage('grid_unsaved_changes_reset') }}</lukso-button
      >
      <lukso-button
        size="small"
        variant="warning"
        :is-loading="isSavingGrid ? true : undefined"
        :loading-text="formatMessage('grid_unsaved_changes_save')"
        @click="emits('save')"
        >{{ formatMessage('grid_unsaved_changes_save') }}</lukso-button
      >
    </div>
  </div>
</template>
