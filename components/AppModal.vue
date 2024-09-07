<script setup lang="ts">
const appStore = useAppStore()
const modalTemplateComponent = shallowRef()
const route = useRoute()
const { closeModal } = useModal()

const loadModalTemplate = () => {
  modalTemplateComponent.value = defineAsyncComponent(() => {
    const templateName = appStore.modal?.template
      ? appStore.modal.template
      : MODAL_DEFAULT_TEMPLATE
    return import(`./ModalTemplate${templateName}.vue`)
  })
}

/**
 * Reset modal query params
 */
const resetModalQueryParams = () => {
  // remove modal query params from the URL
  const modalQueryParams: ModalQueryParams = {
    modalTemplate: undefined,
    modalSize: undefined,
    modalData: undefined,
  }

  // navigate to the same route without modal query params
  try {
    navigateTo({
      path: route.path,
      query: {
        ...route.query,
        ...modalQueryParams,
      },
    })
  } catch (error) {
    console.warn(error)
  }
}

// when modal is opened, load proper template
watch(
  () => appStore.modal?.isOpen,
  () => {
    if (appStore.modal?.isOpen) {
      loadModalTemplate()
    } else {
      if (route.query?.modalTemplate) {
        resetModalQueryParams()
      }

      modalTemplateComponent.value = defineAsyncComponent(() => {
        const templateName = MODAL_DEFAULT_TEMPLATE
        return import(`./ModalTemplate${templateName}.vue`)
      })
    }
  }
)

// watch for modal query params and show modal
watch(
  () => route.query?.modalTemplate,
  modalTemplate => {
    if (modalTemplate) {
      const { modalSize, modalData } = route.query || {}
      loadModalTemplate()
      appStore.setModal({
        isOpen: true,
        template: modalTemplate,
        data: modalData ? JSON.parse(modalData) : undefined,
        size: modalSize || 'small',
      })
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <lukso-modal
    :is-open="appStore.modal?.isOpen ? true : undefined"
    :size="appStore.modal?.size"
    @on-backdrop-click="closeModal"
  >
    <component
      v-if="modalTemplateComponent"
      :is="modalTemplateComponent"
      :close-modal="closeModal"
    ></component>
  </lukso-modal>
</template>
