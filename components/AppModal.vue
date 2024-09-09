<script setup lang="ts">
import type { ModalSizes } from '@lukso/web-components'

const appStore = useAppStore()
const { isModalOpen } = storeToRefs(useAppStore())
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
      appStore.setModal({
        template: modalTemplate,
        data: modalData ? JSON.parse(modalData) : undefined,
        size: modalSize,
      })
    } else {
      loadModalTemplate(MODAL_DEFAULT_TEMPLATE)
      appStore.setModal({
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
    :size="appStore.modal?.size"
    :data-template="appStore.modal?.template"
    @on-backdrop-click="closeModal"
  >
    <component
      v-if="modalTemplateComponent"
      :is="modalTemplateComponent"
      class="animate-fade-in"
    ></component>
  </lukso-modal>
</template>
