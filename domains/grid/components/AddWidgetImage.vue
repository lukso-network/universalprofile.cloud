<script setup lang="ts">
const { formatMessage } = useIntl()
const { selectWidget, clearWidgetData } = useWidgetStore()
const { widgetData } = storeToRefs(useWidgetStore())
const { closeModal } = useModal()
const { addGridLayoutItem, updateGridLayoutItem } = useGrid()

const INPUT_FOCUS_DELAY = 10 // small delay for focusing input after element render
const inputValue = ref<string>('')
const inputError = ref<string>('')

const canSubmit = computed(() => inputValue.value && !inputError.value)
const isEdit = computed(() => !!widgetData.value)

const handleSave = () => {
  if (!canSubmit.value) {
    return
  }

  const properties = {
    src: inputValue.value,
  }

  if (isEdit.value) {
    const updatedWidget: GridWidget = {
      ...(widgetData.value as GridWidget),
      properties,
    }
    updateGridLayoutItem(updatedWidget)
  } else {
    const newWidget: GridWidgetWithoutCords = createWidget({
      type: GRID_WIDGET_TYPE.IMAGE,
      properties,
    })

    addGridLayoutItem(newWidget)
  }

  handleCancel()
}

const handleCancel = () => {
  clearWidgetData()
  closeModal()
}

const handleInput = async (customEvent: CustomEvent) => {
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  inputError.value = ''

  // if no value is entered we just exit here
  if (!input.value) {
    return
  }

  // validation
  try {
    new URL(input.value)
    inputValue.value = input.value
  } catch (error) {
    console.warn(error)
    inputError.value = formatMessage('errors_invalid_url')
    return
  }
}

onMounted(() => {
  setTimeout(() => {
    const input = document?.querySelector(
      'lukso-input'
    ) as unknown as HTMLElement

    input?.shadowRoot?.querySelector('input')?.focus()
  }, INPUT_FOCUS_DELAY)

  inputValue.value = widgetData.value?.properties.src || ''
})
</script>

<template>
  <div class="p-6">
    <div class="flex items-center gap-3 pb-4">
      <lukso-icon
        v-if="!isEdit"
        name="arrow-left-sm"
        class="relative z-[1] cursor-pointer rounded-full bg-neutral-100 shadow-neutral-above-shadow transition hover:scale-105 hover:shadow-neutral-above-shadow-1xl active:scale-100 active:shadow-neutral-above-shadow"
        @click="selectWidget()"
      ></lukso-icon>
      <div class="heading-inter-21-semi-bold">
        {{ formatMessage('add_widget_image_title') }}
      </div>
    </div>
    <div class="paragraph-inter-14-regular pb-6">
      {{ formatMessage('add_widget_image_description') }}
    </div>

    <!-- Image src -->
    <lukso-input
      is-full-width
      autofocus
      :placeholder="formatMessage('add_widget_image_input_placeholder')"
      .value="inputValue"
      :error="inputError"
      @on-input="handleInput"
    ></lukso-input>

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
