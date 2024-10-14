<script setup lang="ts">
import tinycolor from 'tinycolor2'

type Props = {
  type: GridWidgetType
  id?: string
  properties?: GridWidgetProperties
  width?: number
  height?: number
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const { closeModal, showModal } = useModal()
const { addGridLayoutItem, updateGridLayoutItem } = useGrid()

const INPUT_FOCUS_DELAY = 10 // small delay for focusing input after element render
const DEFAULT_PROPERTIES = {
  title: '',
  text: '',
  titleColor: '#243542',
  textColor: '#243542',
  backgroundColor: '#f9f9f9',
}
const inputValues = reactive(DEFAULT_PROPERTIES)
const inputErrors = reactive({
  text: '',
  titleColor: '',
  textColor: '',
  backgroundColor: '',
})

const canSubmit = ref(false)
const isEdit = computed(() => !!props.id)

const handleSave = () => {
  if (!canSubmit.value) {
    return
  }

  const properties = toRaw(inputValues)

  if (isEdit.value) {
    updateGridLayoutItem(props.id, {
      properties,
      w: props.width,
      h: props.height,
    })
  } else {
    const newWidget: GridWidgetWithoutCords = createWidgetObject({
      type: props.type,
      properties,
      w: props.width,
      h: props.height,
    })

    addGridLayoutItem(newWidget)
  }

  handleCancel()
}

const handleCancel = () => {
  closeModal()
}

const handleTitleChange = async (customEvent: CustomEvent) => {
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  inputValues.title = input.value
}

const handleTextChange = async (customEvent: CustomEvent) => {
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  inputErrors.text = ''

  if (!input.value) {
    inputErrors.text = formatMessage('errors_required')
    return
  }

  inputValues.text = input.value
}

const handleTitleColorChange = async (customEvent: CustomEvent) => {
  const event = customEvent.detail.event
  const color = event.target as HTMLInputElement
  const tColor = tinycolor(color.value)
  inputErrors.titleColor = ''

  if (!tColor.isValid()) {
    inputErrors.titleColor = formatMessage('errors_invalid_hex_color')
    return
  }

  inputValues.titleColor = color.value
}

const handleTextColorChange = async (customEvent: CustomEvent) => {
  const event = customEvent.detail.event
  const color = event.target as HTMLInputElement
  const tColor = tinycolor(color.value)
  inputErrors.textColor = ''

  if (!tColor.isValid()) {
    inputErrors.textColor = formatMessage('errors_invalid_hex_color')
    return
  }

  inputValues.textColor = color.value
}

const handleBackgroundColorChange = async (customEvent: CustomEvent) => {
  const event = customEvent.detail.event
  const color = event.target as HTMLInputElement
  const tColor = tinycolor(color.value)
  inputErrors.backgroundColor = ''

  if (!tColor.isValid()) {
    inputErrors.backgroundColor = formatMessage('errors_invalid_hex_color')
    return
  }

  inputValues.backgroundColor = color.value
}

watchEffect(() => {
  canSubmit.value =
    !!inputValues.text &&
    !inputErrors.text &&
    !inputErrors.titleColor &&
    !inputErrors.textColor &&
    !inputErrors.backgroundColor
})

const handleBackToSelection = () => {
  showModal({
    template: 'AddGridWidget',
    forceOpen: true,
    data: {
      type: undefined, // when no type we display selection screen
    },
  })
}

onMounted(() => {
  setTimeout(() => {
    const input = document?.querySelector(
      'lukso-input'
    ) as unknown as HTMLElement

    input?.shadowRoot?.querySelector('input')?.focus()
  }, INPUT_FOCUS_DELAY)

  Object.assign(inputValues, props.properties || DEFAULT_PROPERTIES)
})
</script>

<template>
  <div class="p-6">
    <div class="flex items-center gap-3 pb-4">
      <lukso-icon
        v-if="!isEdit"
        name="arrow-left-sm"
        class="relative z-[1] cursor-pointer rounded-full bg-neutral-100 shadow-neutral-above-shadow transition hover:scale-105 hover:shadow-neutral-above-shadow-1xl active:scale-100 active:shadow-neutral-above-shadow"
        @click="handleBackToSelection"
      ></lukso-icon>
      <div class="heading-inter-21-semi-bold">
        {{
          formatMessage(
            `${isEdit ? 'edit' : 'add'}_widget_${type.toLowerCase()}_title`
          )
        }}
      </div>
    </div>
    <div class="paragraph-inter-14-regular pb-6">
      {{
        formatMessage(
          `${isEdit ? 'edit' : 'add'}_widget_${type.toLowerCase()}_description`
        )
      }}
    </div>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <!-- Title -->
        <lukso-input
          .value="inputValues.title"
          :label="formatMessage('add_widget_text_title_label')"
          :placeholder="formatMessage('add_widget_text_title_placeholder')"
          is-full-width
          autofocus
          @on-input="handleTitleChange"
        ></lukso-input>

        <!-- Title color -->
        <lukso-color-picker
          .value="inputValues.titleColor"
          :placeholder="
            formatMessage('add_widget_text_title_color_placeholder')
          "
          :error="inputErrors.titleColor"
          @on-input="handleTitleColorChange"
        ></lukso-color-picker>
      </div>

      <div class="flex flex-col gap-2">
        <!-- Description -->
        <lukso-textarea
          :value="inputValues.text"
          :label="formatMessage('add_widget_text_text_label')"
          :placeholder="formatMessage('add_widget_text_text_placeholder')"
          :error="inputErrors.text"
          is-full-width
          rows="3"
          autofocus
          @on-input="handleTextChange"
        ></lukso-textarea>

        <!-- Description color -->
        <lukso-color-picker
          .value="inputValues.textColor"
          :placeholder="formatMessage('add_widget_text_text_color_placeholder')"
          :error="inputErrors.textColor"
          @on-input="handleTextColorChange"
        ></lukso-color-picker>
      </div>

      <!-- Background color -->
      <lukso-color-picker
        .value="inputValues.backgroundColor"
        :label="formatMessage('add_widget_text_background_color_label')"
        :placeholder="
          formatMessage('add_widget_text_background_color_placeholder')
        "
        :error="inputErrors.backgroundColor"
        @on-input="handleBackgroundColorChange"
      ></lukso-color-picker>
    </div>

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
