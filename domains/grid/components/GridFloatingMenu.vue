<script setup lang="ts">
import { tv } from 'tailwind-variants'

type Emits = {
  (event: 'on-reset'): void
  (event: 'on-save'): void
  (event: 'on-add-grid'): void
}

const BOTTOM_MARGIN_DESKTOP_PX = 40
const BOTTOM_MARGIN_MOBILE_PX = 16

const emits = defineEmits<Emits>()
const { isEditingGrid, hasUnsavedGrid, isSavingGrid } =
  storeToRefs(useGridStore())
const { isConnected, isMobile, isConnectedUserViewingOwnProfile } =
  storeToRefs(useAppStore())
const { formatMessage } = useIntl()
const { showModal } = useModal()
const bottom = ref(
  isMobile.value ? BOTTOM_MARGIN_MOBILE_PX : BOTTOM_MARGIN_DESKTOP_PX
)

const handleToggleGridEditMode = async () => {
  isEditingGrid.value = !isEditingGrid.value
  setTimeout(() => {
    handleScroll()
  }, 200)
}

const handleAddContent = () => {
  showModal<Partial<GridWidget>>({
    template: 'AddGridWidget',
  })
}

const handleAddGrid = () => {
  showModal<Partial<Grid>>({
    template: 'AddEditGrid',
  })
}

const handleStyle = computed(() => {
  return {
    bottom: `${bottom.value}px`,
    transition: 'bottom 0.3s ease-in-out',
  }
})

const baseButtonVariants = tv({
  base: 'flex size-10 items-center justify-center rounded-full transition-all duration-300',
  variants: {
    isDisabled: {
      true: '',
      false: 'cursor-pointer hover:scale-105',
    },
  },
})

const defaultButtonVariants = tv({
  extend: baseButtonVariants,
  base: 'bg-neutral-97',
  variants: {
    isDisabled: {
      true: '',
      false: 'hover:bg-neutral-95',
    },
  },
})

const resetButtonVariants = tv({
  extend: baseButtonVariants,
  variants: {
    isDisabled: {
      true: 'bg-neutral-97',
      false: 'cursor-pointer bg-[#ffe0e0] hover:scale-105 hover:bg-[#ffd1d1]',
    },
  },
})

const saveButtonVariants = tv({
  extend: baseButtonVariants,
  variants: {
    isDisabled: {
      true: 'bg-neutral-97',
      false: 'cursor-pointer bg-[#E2FFEA] hover:scale-105 hover:bg-[#d6ffe2]',
    },
  },
})

const styles = computed(() => {
  return {
    addWidgetButton: defaultButtonVariants(),
    addGridButton: defaultButtonVariants(),
    saveButton: saveButtonVariants({
      isDisabled: !hasUnsavedGrid.value,
    }),
    resetButton: resetButtonVariants({
      isDisabled: !hasUnsavedGrid.value,
    }),
    toggleButton: defaultButtonVariants(),
  }
})

const handleScroll = () => {
  if (isMobile.value) {
    bottom.value = BOTTOM_MARGIN_MOBILE_PX
    return
  }

  const bottomOffset =
    (document.querySelector('lukso-footer')?.clientHeight || 0) +
    BOTTOM_MARGIN_DESKTOP_PX
  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight + bottomOffset >= documentHeight) {
    bottom.value =
      scrollTop +
      windowHeight +
      bottomOffset +
      BOTTOM_MARGIN_DESKTOP_PX -
      documentHeight
  } else {
    bottom.value = BOTTOM_MARGIN_DESKTOP_PX
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    v-if="isConnected && isConnectedUserViewingOwnProfile"
    class="fixed right-4 z-50 flex animate-fade-in gap-6 overflow-hidden rounded-full bg-neutral-100 p-3 shadow-neutral-drop-shadow duration-300 ease-in-out sm:bottom-10 sm:right-10 sm:flex-col sm:transition-height lg:right-[calc(50%-540px)]"
    :class="{
      'h-[64px] w-[320px] sm:h-[320px] sm:w-[64px]': isEditingGrid,
      'size-[64px]': !isEditingGrid,
    }"
    :style="handleStyle"
  >
    <div v-if="isEditingGrid" class="flex animate-fade-in gap-6 sm:flex-col">
      <!-- Add widget  -->
      <lukso-tooltip
        :class="styles.addWidgetButton"
        :text="!isMobile ? formatMessage('grid_add_widget') : ''"
        placement="left"
        :offset="15"
        :show-delay="1000"
        @click="handleAddContent"
      >
        <lukso-icon name="plus" color="purple-41"></lukso-icon>
      </lukso-tooltip>

      <!-- Add grid  -->
      <lukso-tooltip
        :class="styles.addGridButton"
        :text="!isMobile ? formatMessage('grid_add_grid') : ''"
        placement="left"
        :offset="15"
        :show-delay="1000"
        @click="handleAddGrid"
      >
        <lukso-icon name="menu-1" color="purple-41"></lukso-icon>
      </lukso-tooltip>

      <!-- Reset  -->
      <lukso-tooltip
        :class="styles.resetButton"
        :text="
          hasUnsavedGrid && !isMobile ? formatMessage('grid_can_reset') : ''
        "
        placement="left"
        :offset="15"
        :show-delay="1000"
        @click="hasUnsavedGrid ? emits('on-reset') : undefined"
      >
        <lukso-icon
          name="reload"
          :color="hasUnsavedGrid ? 'red-65' : 'neutral-85'"
          class="-rotate-90 transition"
        ></lukso-icon>
      </lukso-tooltip>

      <!-- Save  -->
      <lukso-tooltip
        :class="styles.saveButton"
        :text="
          hasUnsavedGrid && !isMobile ? formatMessage('grid_can_save') : ''
        "
        placement="left"
        :offset="15"
        :show-delay="1000"
        @click="hasUnsavedGrid && !isSavingGrid ? emits('on-save') : undefined"
      >
        <lukso-icon
          :name="isSavingGrid ? 'spinner' : 'tick'"
          :color="hasUnsavedGrid ? 'green-54' : 'neutral-85'"
          :class="{
            'animate-spin': isSavingGrid,
          }"
        ></lukso-icon>
      </lukso-tooltip>
    </div>

    <!-- Edit mode toggle -->
    <lukso-tooltip
      :class="styles.toggleButton"
      :text="
        !isMobile
          ? isEditingGrid
            ? formatMessage('grid_exit_edit_mode')
            : formatMessage('grid_enable_edit_mode')
          : ''
      "
      placement="left"
      :offset="15"
      :show-delay="1000"
      @click="handleToggleGridEditMode"
    >
      <lukso-icon
        :name="isEditingGrid ? 'close-lg' : 'edit'"
        color="purple-41"
      ></lukso-icon>
    </lukso-tooltip>
  </div>
</template>
