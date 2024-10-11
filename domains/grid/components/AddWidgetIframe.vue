<script setup lang="ts">
type Props = {
  platform: GridWidgetType
  id?: string
  properties?: GridWidgetProperties
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const { selectWidget, clearWidgetData } = useGridStore()
const { closeModal } = useModal()
const { addGridLayoutItem, updateGridLayoutItem } = useGrid()

const TEXTAREA_FOCUS_DELAY = 10 // small delay for focusing textarea after element render
const inputValue = ref('')
const inputError = ref('')

const canSubmit = computed(() => inputValue.value && !inputError.value)
const isEdit = computed(() => !!props.properties)

const handleSave = () => {
  if (!canSubmit.value) {
    return
  }

  const properties = {
    src: inputValue.value,
  }

  if (isEdit.value && props.id) {
    updateGridLayoutItem(props.id, { properties })
  } else {
    const newWidget: GridWidgetWithoutCords = createWidgetObject({
      type: props.platform,
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
    const textarea = document?.querySelector(
      'lukso-textarea'
    ) as unknown as HTMLElement

    textarea?.shadowRoot?.querySelector('textarea')?.focus()
  }, TEXTAREA_FOCUS_DELAY)

  inputValue.value = props.properties?.src || ''
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
        {{ formatMessage(`add_widget_${platform.toLowerCase()}_title`) }}
      </div>
    </div>
    <div class="paragraph-inter-14-regular pb-6">
      {{ formatMessage(`add_widget_${platform.toLowerCase()}_description`) }}
    </div>

    <!-- Iframe content -->
    <lukso-textarea
      is-full-width
      autofocus
      :placeholder="formatMessage('add_widget_iframe_input_placeholder')"
      :value="inputValue"
      :error="inputError"
      @on-input="handleInput"
    ></lukso-textarea>

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
