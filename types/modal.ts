import type { ModalSizes } from '@lukso/web-components'

export type Modal = {
  title?: string
  message?: string
  isOpen?: boolean
  confirmButtonText?: string
  icon?: string
  template?: string
  data?: {
    [key: string]: any
  }
  size?: ModalSizes
  isUrlModal?: boolean
}

export type ModalQueryParams = {
  modalTemplate?: string
  modalSize?: ModalSizes
  modalData?: any
}
