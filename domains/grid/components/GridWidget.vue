<script setup lang="ts">
import { computedAsync, useIntersectionObserver } from '@vueuse/core'
import { z } from 'zod'

import type { LuksoDropdownOnChangeEventDetail } from '@lukso/web-components'

type Props = {
  widget: GridWidget
}

const props = defineProps<Props>()
const widgetComponent = shallowRef<Component | undefined>()
const { canEditGrid, addGridWidget, getGridById } = useGrid()
const { formatMessage } = useIntl()
const { showModal } = useModal()
const { isConnected, isMobile, isViewingOwnProfile, connectedProfileAddress } =
  storeToRefs(useAppStore())
const { isEditingGrid, tempGrid, selectedGridId, tempGrids } =
  storeToRefs(useGridStore())
const { connect } = useBaseProvider()
const { browserSupportExtension } = useBrowser()
const dropdownId = `dropdown-${generateItemId()}`
const isOpen = ref<boolean | undefined>(undefined)
const targetIsVisible = ref(false)
const target = ref<HTMLElement | null>(null)

const isAllowToEdit = computed(
  () => canEditGrid.value && !isAddContentWidget.value
)

const isAddContentWidget = computed(
  () => props.widget.type === GRID_WIDGET_TYPE.enum.ADD_CONTENT
)

const isAllowToClone = computed(
  () => isEditingGrid.value || !isViewingOwnProfile.value
)

const src = computedAsync(async () => {
  const schema = z.object({
    src: z.string().transform(urlTransform),
  })
  const validate = await schema.safeParseAsync(props.widget.properties)

  return validate.data?.src
})

const isAllowToOpenInNewTab = computed(() => !!src.value)

const isAllowToShowOptions = computed(
  () =>
    !isAddContentWidget.value &&
    (isAllowToClone.value || isAllowToOpenInNewTab.value || isAllowToEdit.value)
)

const WIDGET_COMPONENTS: Record<string, string> = {
  [GRID_WIDGET_TYPE.enum.TEXT]: 'Text',
  [GRID_WIDGET_TYPE.enum.IMAGE]: 'Image',
  [GRID_WIDGET_TYPE.enum.IFRAME]: 'Iframe',
  [GRID_WIDGET_TYPE.enum.X]: 'X',
  [GRID_WIDGET_TYPE.enum.INSTAGRAM]: 'Instagram',
  [GRID_WIDGET_TYPE.enum.ADD_CONTENT]: 'AddContent',
  [GRID_WIDGET_TYPE.enum.SPOTIFY]: 'Spotify',
  [GRID_WIDGET_TYPE.enum.SOUNDCLOUD]: 'Iframe',
  [GRID_WIDGET_TYPE.enum.WARPCAST]: 'Iframe',
  [GRID_WIDGET_TYPE.enum.YOUTUBE]: 'Youtube',
}

const loadWidgetComponent = (type: string): Component | undefined => {
  if (!WIDGET_COMPONENTS[type]) {
    console.warn(`Widget type ${type} is not supported`)
    return undefined
  }

  return defineAsyncComponent(
    () => import(`./GridWidget${WIDGET_COMPONENTS[type]}.vue`)
  )
}

const handleDelete = () => {
  showModal({
    template: 'DeleteGridWidget',
    data: {
      id: props.widget.i,
    },
  })
}

const handleEdit = () => {
  showModal<Partial<GridWidget>>({
    template: 'AddGridWidget',
    data: {
      properties: props.widget.properties,
      i: props.widget.i,
      type: props.widget.type,
      w: props.widget.w,
      h: props.widget.h,
    },
  })
}

const handleMove = () => {
  showModal({
    template: 'MoveGridWidget',
    data: {
      type: props.widget.type,
      properties: props.widget.properties,
      id: props.widget.i,
      w: props.widget.w,
      h: props.widget.h,
    },
  })
}

const handleOpenInTab = () => {
  navigateTo(src.value, {
    external: true,
    open: {
      target: '_blank',
    },
  })
}

const handleClone = async () => {
  if (!browserSupportExtension.value && !isMobile.value) {
    return
  }

  if (!isConnected.value) {
    await connect()
  }

  const _connectedProfileAddress =
    connectedProfileAddress.value?.toLowerCase() as Address
  const clonedWidget = createWidgetObject({
    type: props.widget.type,
    properties: props.widget.properties,
    w: props.widget.w,
    h: props.widget.h,
  })
  isEditingGrid.value = true // we enable edit mode so user is aware about unsaved state

  // in case we are on own profile we do simply widget copy
  if (isViewingOwnProfile.value) {
    addGridWidget(
      clonedWidget,
      getGridById(tempGrid.value, selectedGridId.value)
    )
    return
  }

  // re-create temp grid if missing
  if (!tempGrids.value[_connectedProfileAddress]) {
    const userGrid = await getUserGrid(_connectedProfileAddress)
    tempGrids.value[_connectedProfileAddress] = buildGrid(
      userGrid,
      isMobile.value
    )
  }

  addGridWidget(
    clonedWidget,
    getGridById(
      tempGrids.value[_connectedProfileAddress],
      tempGrids.value[_connectedProfileAddress][0].id
    )
  )
  showModal({
    template: 'GridWidgetCloned',
  })
}

const handleDropdownChange = (
  event: CustomEvent<LuksoDropdownOnChangeEventDetail>
) => {
  isOpen.value = event.detail?.isOpen ? true : undefined
}

onMounted(() => {
  widgetComponent.value = loadWidgetComponent(props.widget.type)

  setTimeout(() => {
    useIntersectionObserver(
      target,
      ([{ isIntersecting }], _observerElement) => {
        targetIsVisible.value = targetIsVisible.value || isIntersecting
      },
      {
        rootMargin: '100px', // load margin before target appear in viewport
      }
    )
  }, 1)
})
</script>

<template>
  <div
    ref="target"
    class="group relative flex h-full flex-col rounded-12 transition"
    :class="{
      'bg-neutral-100 shadow-neutral-shadow-round hover:shadow-neutral-shadow-round-1xl':
        !isAddContentWidget,
      'select-none': isAllowToEdit,
      'z-50': isOpen,
    }"
  >
    <!-- Move overlay -->
    <div
      v-if="isAllowToEdit && !isMobile"
      class="grid-move-overlay absolute inset-0 z-10 cursor-move rounded-[inherit] bg-neutral-100 opacity-0 transition-opacity group-hover:opacity-60"
    ></div>

    <!-- Widget options -->
    <div
      v-if="isAllowToShowOptions"
      class="grid-widget-options absolute right-2 top-2 z-20 mb-2 cursor-pointer"
      :class="{
        'invisible group-hover:visible': !isAllowToEdit,
      }"
    >
      <div
        class="mb-1 flex size-[35px] items-center justify-center rounded-full border border-neutral-90 bg-neutral-100 shadow-neutral-shadow-round-1xl transition hover:scale-105"
      >
        <lukso-icon
          :id="dropdownId"
          name="dots"
          size="medium"
          class="p-2"
        ></lukso-icon>
      </div>
      <lukso-dropdown
        :trigger-id="dropdownId"
        is-right
        size="medium"
        @on-change="handleDropdownChange"
      >
        <!-- Edit option -->
        <lukso-dropdown-option
          v-if="isAllowToEdit"
          size="medium"
          @click="handleEdit"
        >
          <lukso-icon name="edit" size="small"></lukso-icon>
          {{ formatMessage('grid_widget_menu_edit') }}</lukso-dropdown-option
        >

        <!-- Move option -->
        <lukso-dropdown-option
          v-if="isAllowToEdit"
          size="medium"
          @click="handleMove"
        >
          <lukso-icon name="link-1" size="small"></lukso-icon>
          {{ formatMessage('grid_widget_menu_move') }}</lukso-dropdown-option
        >

        <!-- Clone option -->
        <lukso-dropdown-option
          v-if="isAllowToClone"
          size="medium"
          @click="handleClone"
          :is-disabled="
            !browserSupportExtension && !isMobile ? true : undefined
          "
        >
          <lukso-icon name="copy" size="small"></lukso-icon>
          <span v-if="isViewingOwnProfile">
            {{ formatMessage('grid_widget_menu_clone') }}
          </span>
          <span v-else>
            {{ formatMessage('grid_widget_menu_clone_to_my_grid') }}
          </span>
        </lukso-dropdown-option>

        <!-- Open in new tab option -->
        <lukso-dropdown-option
          v-if="isAllowToOpenInNewTab"
          size="medium"
          @click="handleOpenInTab"
        >
          <lukso-icon name="link-3" size="small"></lukso-icon>
          {{
            formatMessage('grid_widget_menu_open_in_new_tab')
          }}</lukso-dropdown-option
        >

        <!-- Delete option -->
        <lukso-dropdown-option
          v-if="isAllowToEdit"
          size="medium"
          @click="handleDelete"
          ><lukso-icon name="trash" size="small" color="red-65"></lukso-icon
          ><span class="text-red-65">{{
            formatMessage('grid_widget_menu_delete')
          }}</span></lukso-dropdown-option
        >
      </lukso-dropdown>
    </div>

    <!-- Resize handle -->
    <div
      v-if="isAllowToEdit && !isMobile"
      class="grid-widget-resize absolute bottom-2 right-2 z-10 mb-1 flex size-[35px] cursor-pointer items-center justify-center rounded-full border border-neutral-90 bg-neutral-100 opacity-0 shadow-neutral-shadow-round-1xl transition hover:scale-105 group-hover:opacity-100"
    >
      <lukso-icon
        name="expand"
        size="medium"
        class="rotate-90 p-2"
      ></lukso-icon>
    </div>

    <!-- Loaded component based on widget type -->
    <component
      v-if="widgetComponent && targetIsVisible"
      :is="widgetComponent"
      v-bind="widget.properties"
      :widget="widget"
    ></component>
  </div>
</template>
