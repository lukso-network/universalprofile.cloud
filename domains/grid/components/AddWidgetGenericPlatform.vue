<script setup lang="ts">
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
const { addGridWidget, updateGridWidget, getGridById } = useGrid()
const { tempGrid, selectedGridId } = storeToRefs(useGridStore())

const inputValue = ref('')
const inputError = ref('')

const canSubmit = computed(() => inputValue.value && !inputError.value)
const isEdit = computed(() => !!props.id)

const handleSave = async () => {
  if (!canSubmit.value) {
    return
  }

  try {
    const { properties } = await parsePlatformInput(
      props.type,
      inputValue.value
    )

    if (isEdit.value) {
      updateGridWidget(props.id, {
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

      addGridWidget(
        newWidget,
        getGridById(tempGrid.value, selectedGridId.value)
      )
    }

    handleCancel()
  } catch {
    inputError.value = formatMessage('errors_invalid_input', {
      name: capitalize(props.type),
    })
  }
}

const handleCancel = () => {
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
    const { properties } = await parsePlatformInput(props.type, input.value)
    inputValue.value = properties.src
  } catch (error) {
    console.warn(error)
    inputError.value = formatMessage('errors_invalid_input', {
      name: capitalize(props.type),
    })
    return
  }
}

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

    <!-- Content -->
    <lukso-textarea
      is-full-width
      autofocus
      :placeholder="
        formatMessage(`add_widget_${type.toLowerCase()}_input_placeholder`)
      "
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
