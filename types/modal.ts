import type { ModalSizes } from '@lukso/web-components'

export interface Modal {
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
}
