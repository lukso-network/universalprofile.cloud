<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

import type { SelectStringOption } from '@lukso/web-components'

const widgetTypes = ref<SelectStringOption[]>()
const selectedWidgetType = ref<SelectStringOption>()
const formValues = ref<Record<string, any>>({})
const { hasUnsavedGrid } = storeToRefs(useAppStore())
const { closeModal } = useModal()

const resetFormValues = (properties: Property[]) => {
  formValues.value = {}

  for (const property of properties) {
    formValues.value[property.key] = property.optional ? '' : null
  }
}

watch(selectedWidgetType, newOption => {
  if (newOption) {
    const newType = newOption.value as GridWidgetType
    const properties = WIDGET_TYPE_PROPERTIES[newType] || []
    resetFormValues(properties)
  }
})

const selectedProperties = computed(() => {
  if (selectedWidgetType.value) {
    return (
      WIDGET_TYPE_PROPERTIES[
        selectedWidgetType.value.value as GridWidgetType
      ] || []
    )
  }
  return []
})

const handleSave = () => {
  if (selectedWidgetType.value) {
    const newWidget: GridWidget = {
      type: GRID_WIDGET_TYPE[selectedWidgetType.value.value as GridWidgetType],
      width: 1,
      height: 1,
      properties: { ...formValues.value },
      id: uuidv4(),
    }

    addGridLayoutItem(newWidget)
  }

  hasUnsavedGrid.value = true
  closeModal()
}

function handleCancel() {
  selectedWidgetType.value = undefined
  formValues.value = {}
}

function handleInput(event: CustomEvent, key: string) {
  formValues.value[key] = event.detail.value
}

function handleWidgetTypeChange(event: CustomEvent) {
  selectedWidgetType.value = event.detail.value as SelectStringOption
}

onMounted(() => {
  widgetTypes.value = Object.values(GRID_WIDGET_TYPE).map(type => {
    return {
      id: type,
      value: type,
    }
  })
})
</script>

<template>
  <div class="p-4">
    <h2 class="mb-4 text-lg font-bold">Add New Widget</h2>

    <!-- Widget Type Selector using lukso-select -->
    <!-- TODO: This will change once the designs are done -->
    <div class="mb-4">
      <label class="mb-2 block text-sm font-medium">Select Widget Type:</label>
      <lukso-select
        :value="JSON.stringify(selectedWidgetType)"
        :options="JSON.stringify(widgetTypes)"
        is-full-width
        @on-select="handleWidgetTypeChange"
      ></lukso-select>
    </div>

    <!-- Dynamic Form Fields -->
    <div v-if="selectedWidgetType" class="space-y-4">
      <div v-for="property in selectedProperties" :key="property.key">
        <label :for="property.key" class="mb-1 block text-sm font-medium">
          {{ property.key }} ({{ property.type }})
          {{ property.optional ? '(optional)' : '' }}
        </label>
        <lukso-input
          v-if="
            property.type === 'string' ||
            property.type === 'url' ||
            property.type === 'number'
          "
          :value="formValues[property.key]"
          :placeholder="'Enter ' + property.key"
          is-full-width
          @on-input="(event: CustomEvent) => handleInput(event, property.key)"
        ></lukso-input>
        <!-- TODO: We should only allow lukso web components colors -->
        <lukso-input
          v-if="property.type === 'color'"
          :value="formValues[property.key] || '#000000'"
          type="color"
          is-full-width
          @on-input="(event: CustomEvent) => handleInput(event, property.key)"
        ></lukso-input>
        <lukso-input
          v-if="property.type === 'boolean'"
          type="checkbox"
          :checked="formValues[property.key]"
          @on-input="(event: CustomEvent) => handleInput(event, property.key)"
        ></lukso-input>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-4 flex justify-end space-x-2">
      <lukso-button @click="handleSave" size="small"> Save </lukso-button>
      <lukso-button @click="handleCancel" size="small"> Cancel </lukso-button>
    </div>
  </div>
</template>
