<script setup lang="ts">
import { useElementSize, useWindowSize } from '@vueuse/core'

import type { ModalSizes } from '@lukso/web-components'

const { setModal } = useAppStore()
const { isModalOpen, modal } = storeToRefs(useAppStore())
const modalTemplateComponent = shallowRef()
const route = useRoute()
const { closeModal } = useModal()
const modalContainer = ref<HTMLElement | null>(null)
const { height: modalHeight } = useElementSize(modalContainer)
const { height: screenHeight } = useWindowSize()

/**
 * Load modal template component
 *
 * @param name
 */
const loadModalTemplate = (name: string) => {
  modalTemplateComponent.value = defineAsyncComponent(() => {
    return import(`./ModalTemplate${name}.vue`)
  })
}

// watch for modal query params and show/hide modal
watch(
  () => route.query?.modalTemplate,
  modalTemplate => {
    if (modalTemplate) {
      const {
        modalSize,
        modalData,
      }: { modalSize: ModalSizes; modalData?: string } = route.query || {}

      loadModalTemplate(modalTemplate)
      setModal({
        template: modalTemplate,
        data: modalData ? JSON.parse(modalData) : undefined,
        size: modalSize || 'small',
      })
    } else {
      loadModalTemplate(MODAL_DEFAULT_TEMPLATE)
      setModal({
        template: undefined,
        data: undefined,
        size: undefined,
      })
    }
  },
  { deep: true, immediate: true }
)

const handleKeyDown = (event: KeyboardEvent) => {
  const activeElement = document.activeElement?.tagName
  const key = event.key

  if (key === 'Escape' && activeElement === 'BODY') {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <lukso-modal
    :is-open="isModalOpen ? true : undefined"
    :size="modal?.size"
    :data-template="modal?.template"
    @on-backdrop-click="closeModal"
  >
    <div
      ref="modalContainer"
      class="max-h-[calc(100vh-100px)]"
      :class="{
        'overflow-y-auto': modalHeight > screenHeight - 150,
      }"
    >
      <component
        v-if="modalTemplateComponent"
        :is="modalTemplateComponent"
        class="animate-fade-in"
      ></component>
    </div>
  </lukso-modal>
</template>
