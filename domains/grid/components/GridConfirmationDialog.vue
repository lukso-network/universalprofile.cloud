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
    class="paragraph-inter-12-regular fixed bottom-20 left-[calc(50%-250px)] flex w-[500px] items-center justify-between gap-4 rounded-8 border-[3px] border-yellow-55 bg-neutral-100 p-4"
  >
    {{ formatMessage('grid_unsaved_changes_text') }}
    <div class="flex items-center">
      <lukso-button size="small" variant="text" @click="emits('cancel')">{{
        formatMessage('grid_unsaved_changes_reset')
      }}</lukso-button>
      <lukso-button size="small" variant="warning" @click="emits('save')">{{
        formatMessage('grid_unsaved_changes_save')
      }}</lukso-button>
    </div>
  </div>
</template>
