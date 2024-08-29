import type { Modal } from '@/types/modal'

/**
 * Trigger modal
 *
 * @param data
 */
const showModal = (modal: Modal | string) => {
  if (typeof modal === 'object' && modal.isUrlModal) {
    return setModalQueryParams(modal)
  }

  const appStore = useAppStore()
  const modalDefaults: Modal = {
    isOpen: true,
    icon: '/images/up-error.png',
    size: 'small',
  }

  if (typeof modal === 'string') {
    appStore.setModal({ ...modalDefaults, message: modal })
  } else {
    appStore.setModal({ ...modalDefaults, ...modal })
  }
}

/**
 * Set modal query params
 *
 * @param modal
 */
const setModalQueryParams = (modal: Modal) => {
  const route = useRoute()

  const modalQueryParams: ModalQueryParams = {
    modalTemplate: modal.template,
    modalSize: modal.size,
    modalData: JSON.stringify(modal.data),
  }

  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      ...modalQueryParams,
    },
  })
}

export const useModal = () => {
  return {
    showModal,
  }
}
