<script setup lang="ts">
import { detectSocialMedia } from '@lukso/web-components/tools'
import { computedAsync } from '@vueuse/core'

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
const isEdit = computed(() => !!props.id)

const getSrc = async () => {
  // in edit we read src from properties
  if (isEdit.value) {
    const parse = await WIDGET_SCHEMA_MAP[props.type]?.build?.safeParseAsync(
      props.properties
    )
    return parse?.data?.src
  }
}

const getType = async () => {
  // in edit mode we want to detect if the iframe is not a supported platform
  if (isEdit.value && props.type === GRID_WIDGET_TYPE.enum.IFRAME) {
    const platform = detectSocialMedia(await getSrc())

    if (platform) {
      return platform.toUpperCase() as GridWidgetType
    }
  }

  return props.type
}

const widgetType = computedAsync(async () => {
  return await getType()
})

const schemaMap = WIDGET_SCHEMA_MAP[await getType()]
const {
  inputValues,
  canSubmit,
  getFieldErrorMessage,
  handleFieldChange,
  handleFormErrors,
} = useForm(schemaMap?.input, {
  input: await getSrc(),
})
const isInstructionsVisible = ref(false)

const handleSave = async () => {
  if (!canSubmit.value) {
    return
  }

  try {
    const inputParse = await schemaMap?.input?.safeParseAsync(inputValues.value)
    const properties = await schemaMap?.output?.parseAsync(inputParse?.data)

    if (isEdit.value) {
      updateGridWidget(props.id, {
        properties,
        w: props.width,
        h: props.height,
      })
    } else {
      const newWidget: GridWidgetWithoutCords = createWidgetObject({
        type: inputParse?.data?.widgetType, // widget type is not based on selection but on the parsing result
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

const widgetInstructions = computed(() => {
  return formatMessage(
    `add_widget_${widgetType.value.toLowerCase()}_instructions`
  )
})

const hasInstructions = computed(() => widgetInstructions.value !== '-')
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
            `${isEdit ? 'edit' : 'add'}_widget_${widgetType.toLowerCase()}_title`
          )
        }}
      </div>
    </div>
    <div class="paragraph-inter-14-regular pb-6">
      <lukso-sanitize
        :html-content="
          formatMessage(
            `${isEdit ? 'edit' : 'add'}_widget_${widgetType.toLowerCase()}_description`
          )
        "
      ></lukso-sanitize>

      <!-- Instructions -->
      <div v-if="hasInstructions" class="mt-2">
        <div class="flex items-center">
          <span
            v-if="isInstructionsVisible"
            class="cursor-pointer text-purple-51 underline hover:text-purple-41"
            @click="isInstructionsVisible = !isInstructionsVisible"
            >Hide instructions</span
          >
          <span
            v-else
            class="cursor-pointer text-purple-51 underline hover:text-purple-41"
            @click="isInstructionsVisible = !isInstructionsVisible"
            >Show instructions</span
          >
          <lukso-icon
            name="arrow-down-sm"
            color="purple-51"
            :class="{
              'rotate-180 transition': isInstructionsVisible,
            }"
          ></lukso-icon>
        </div>
        <div
          v-if="isInstructionsVisible"
          class="mt-4 animate-fade-in whitespace-pre-line font-600 break-word"
        >
          <lukso-sanitize :html-content="widgetInstructions"></lukso-sanitize>
        </div>
      </div>
    </div>

    <!-- Content -->
    <lukso-textarea
      is-full-width
      autofocus
      :placeholder="
        formatMessage(
          `add_widget_${widgetType.toLowerCase()}_input_placeholder`
        )
      "
      :value="inputValues.input"
      :error="getFieldErrorMessage('input')"
      @on-input="
        (customEvent: CustomEvent) => handleFieldChange(customEvent, 'input')
      "
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
