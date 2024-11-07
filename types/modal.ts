import type { ModalSizes } from '@lukso/web-components'

export type Modal<T = ModalData> = {
  template?: string
  data?: T
  size?: ModalSizes
  forceOpen?: boolean
}

export type ModalQueryParams = {
  modalTemplate?: string
  modalSize?: ModalSizes
  modalData?: any
}

export type ModalData = {
  [key: string]: any
}

export type DefaultModalData = {
  message: string
  title?: string
  confirmButtonText?: string
  icon?: string
}
