<script setup lang="ts">
type Emits = {
  (event: 'cancel'): void
  (event: 'save'): void
}

const emits = defineEmits<Emits>()
const { hasUnsavedGrid } = storeToRefs(useAppStore())
const { formatMessage } = useIntl()
</script>

<template>
  <div
    v-if="hasUnsavedGrid"
    class="paragraph-inter-12-regular fixed bottom-5 left-[calc(50%-250px)] flex w-[500px] items-center justify-between gap-4 rounded-8 border-[3px] border-green-54 bg-neutral-100 p-4"
  >
    {{ formatMessage('grid_unsaved_changes_text') }}
    <div class="flex items-center">
      <lukso-button size="small" variant="text" @click="emits('cancel')">{{
        formatMessage('grid_unsaved_changes_reset')
      }}</lukso-button>
      <!-- TODO create this button variant -->
      <lukso-button
        size="small"
        variant="primary"
        custom-class="border-green-54 bg-green-54 hover:bg-green-54 hover:border-green-54"
        @click="emits('save')"
        >{{ formatMessage('grid_unsaved_changes_save') }}</lukso-button
      >
    </div>
  </div>
</template>
