<script setup lang="ts">
import type { SelectStringOption } from '@lukso/web-components'

const { modal, closeModal } = useModal()
const { formatMessage } = useIntl()
const { tempGridLayout, selectedLayoutId } = storeToRefs(useGridStore())
const { addGridLayoutItem, removeGridLayoutItem, getGridById } = useGrid()
const selectedOption = ref<string>()

const canSubmit = computed(
  () => selectedOption.value !== selectedLayoutId.value
)

const options = computed<SelectStringOption[]>(() => {
  return tempGridLayout.value.map(grid => ({
    id: grid.id,
    value: grid.title,
  }))
})

const selectedOptionValue = computed(() => {
  const grid = tempGridLayout.value.find(
    grid => grid.id === selectedOption.value
  )
  return {
    id: grid?.id,
    value: grid?.title,
  }
})

const handleChange = async (customEvent: CustomEvent) => {
  const option = customEvent.detail.value as SelectStringOption

  selectedOption.value = option.id
}

const handleCancel = () => {
  closeModal()
}

const handleSave = () => {
  if (!canSubmit.value) {
    return
  }

  const duplicatedWidget = createWidgetObject({
    type: modal?.data?.type,
    properties: modal?.data?.properties,
    w: modal?.data?.w,
    h: modal?.data?.h,
  })

  removeGridLayoutItem(modal?.data?.id)
  addGridLayoutItem(
    duplicatedWidget,
    getGridById(tempGridLayout.value, selectedOption.value)
  )
  handleCancel()
}

onMounted(() => {
  selectedOption.value = selectedLayoutId.value
})
</script>

<template>
  <div class="p-6">
    <div class="heading-inter-21-semi-bold pb-4">
      {{ formatMessage('move_widget_title') }}
    </div>
    <div class="paragraph-inter-14-regular pb-6">
      {{ formatMessage('move_widget_description') }}
    </div>

    <lukso-select
      :value="JSON.stringify(selectedOptionValue)"
      :options="JSON.stringify(options)"
      is-full-width
      autofocus
      @on-select="handleChange"
    ></lukso-select>

    <!-- Buttons -->
    <div class="grid grid-cols-[max-content,auto] pt-6">
      <lukso-button variant="text" @click="handleCancel">
        {{ formatMessage('add_widget_cancel') }}
      </lukso-button>
      <lukso-button
        :disabled="!canSubmit ? true : undefined"
        variant="landing"
        is-full-width
        @click="handleSave"
      >
        {{ formatMessage('add_widget_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
