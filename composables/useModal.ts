import type { Modal } from '@/types/modal'

/**
 * Show modal
 *
 * @param data
 */
const showModal = async (modal: Modal) => {
  const route = useRoute()
  const { isModalOpen } = storeToRefs(useAppStore())

  if (isModalOpen.value && !modal.forceOpen) {
    return
  }

  const modalQueryParams: ModalQueryParams = {
    modalTemplate: modal.template || 'Default',
    modalSize: modal.size || 'small',
    modalData: JSON.stringify(modal.data),
  }

  await navigateTo({
    path: route.path,
    query: {
      ...route.query,
      ...modalQueryParams,
    },
  })
}

/**
 * Close modal
 */
const closeModal = async () => {
  const route = useRoute()

  const modalQueryParams: ModalQueryParams = {
    modalTemplate: undefined,
    modalSize: undefined,
    modalData: undefined,
  }

  await navigateTo({
    path: route.path,
    query: {
      ...route.query,
      ...modalQueryParams,
    },
  })
}

export const useModal = () => {
  const { modal } = useAppStore()

  return {
    showModal,
    closeModal,
    modal,
  }
}
