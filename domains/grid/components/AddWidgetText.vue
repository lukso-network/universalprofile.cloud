<script setup lang="ts">
type Props = {
  type: GridWidgetType
  id?: string
  properties?: TextWidgetProperties
  width?: number
  height?: number
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const { closeModal, showModal } = useModal()
const { addGridWidget, updateGridWidget, getGridById } = useGrid()
const { tempGrid, selectedGridId } = storeToRefs(useGridStore())
const schema = widgetSchemaMap[props.type]
const isEdit = computed(() => !!props.id)
const {
  inputValues,
  canSubmit,
  getFieldErrorMessage,
  handleFieldChange,
  handleFormErrors,
} = useForm(schema, schema?.optional().parse(props.properties || {}))

const handleSave = () => {
  if (!canSubmit.value) {
    return
  }

  try {
    const properties = schema?.parse(inputValues.value)

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
  } catch (error: unknown) {
    handleFormErrors(error)
  }
}

const handleCancel = () => {
  closeModal()
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
      <!-- Background color -->
      <lukso-color-picker
        .value="inputValues?.backgroundColor"
        id="background-color"
        :label="formatMessage('add_widget_text_background_color_label')"
        :placeholder="
          formatMessage('add_widget_text_background_color_placeholder')
        "
        :error="getFieldErrorMessage('backgroundColor')"
        autofocus
        @on-input="
          (customEvent: CustomEvent) =>
            handleFieldChange(customEvent, 'backgroundColor')
        "
      ></lukso-color-picker>

      <div class="flex flex-col gap-2">
        <!-- Title -->
        <lukso-input
          .value="inputValues?.title"
          :label="formatMessage('add_widget_text_title_label')"
          :placeholder="formatMessage('add_widget_text_title_placeholder')"
          is-full-width
          @on-input="
            (customEvent: CustomEvent) =>
              handleFieldChange(customEvent, 'title')
          "
        ></lukso-input>

        <!-- Title color -->
        <lukso-color-picker
          .value="inputValues?.titleColor"
          :placeholder="
            formatMessage('add_widget_text_title_color_placeholder')
          "
          :error="getFieldErrorMessage('titleColor')"
          @on-input="
            (customEvent: CustomEvent) =>
              handleFieldChange(customEvent, 'titleColor')
          "
        ></lukso-color-picker>
      </div>

      <div class="flex flex-col gap-2">
        <!-- Description -->
        <lukso-textarea
          :value="inputValues?.text"
          :label="formatMessage('add_widget_text_text_label')"
          :placeholder="formatMessage('add_widget_text_text_placeholder')"
          is-full-width
          rows="3"
          @on-input="
            (customEvent: CustomEvent) => handleFieldChange(customEvent, 'text')
          "
        ></lukso-textarea>

        <!-- Description color -->
        <lukso-color-picker
          .value="inputValues?.textColor"
          :placeholder="formatMessage('add_widget_text_text_color_placeholder')"
          :error="getFieldErrorMessage('textColor')"
          @on-input="
            (customEvent: CustomEvent) =>
              handleFieldChange(customEvent, 'textColor')
          "
        ></lukso-color-picker>
      </div>
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
