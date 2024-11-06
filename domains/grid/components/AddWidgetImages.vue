<script setup lang="ts">
type Props = {
  type: GridWidgetType
  id?: string
  properties?: ImagesWidgetProperties
  width?: number
  height?: number
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const { closeModal, showModal } = useModal()
const { addGridWidget, updateGridWidget, getGridById } = useGrid()
const { tempGrid, selectedGridId } = storeToRefs(useGridStore())
const schemaMap = WIDGET_SCHEMA_MAP[props.type]
const isEdit = computed(() => !!props.id)
const {
  inputValues,
  canSubmit,
  getFieldErrorMessage,
  handleArrayChange,
  handleFormErrors,
} = useForm(
  schemaMap?.input,
  (await schemaMap?.build?.safeParseAsync(props.properties || {}))?.data || {
    images: [''],
  }
)

const handleSave = async () => {
  if (!canSubmit.value) {
    return
  }

  try {
    const properties = await schemaMap?.input?.parseAsync(inputValues.value)

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
  showModal<Partial<GridWidget>>({
    template: 'AddGridWidget',
    forceOpen: true,
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
      <!-- Images -->
      <lukso-input
        v-for="(image, index) in inputValues?.images || []"
        :key="index"
        .value="image"
        :placeholder="formatMessage('add_widget_images_placeholder')"
        :error="getFieldErrorMessage('images', index)"
        is-full-width
        @on-input="
          (customEvent: CustomEvent) =>
            handleArrayChange(customEvent, 'images', index)
        "
      ></lukso-input>
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
