<script setup lang="ts">
import type { ModalSizes } from '@lukso/web-components'

const { setModal } = useAppStore()
const { isModalOpen, modal } = storeToRefs(useAppStore())
const modalTemplateComponent = shallowRef()
const route = useRoute()
const { closeModal } = useModal()

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
        size: modalSize,
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
</script>

<template>
  <lukso-modal
    :is-open="isModalOpen ? true : undefined"
    :size="modal?.size"
    :data-template="modal?.template"
    @on-backdrop-click="closeModal"
  >
    <component
      v-if="modalTemplateComponent"
      :is="modalTemplateComponent"
      class="animate-fade-in"
    ></component>
  </lukso-modal>
</template>
