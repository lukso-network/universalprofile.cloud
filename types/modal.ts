import type { ModalSizes } from '@lukso/web-components'

export type Modal = {
  template?: string
  data?: {
    [key: string]: any
  }
  size?: ModalSizes
}

export type ModalQueryParams = {
  modalTemplate?: string
  modalSize?: ModalSizes
  modalData?: any
}
