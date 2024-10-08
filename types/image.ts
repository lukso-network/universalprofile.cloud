import type { ImageMetadata } from '@lukso/lsp-smart-contracts'

export type Image = {
  hash?: string
  width?: number
  height?: number
  hashFunction?: string
  url?: string
  verification?: ImageMetadata['verification']
  src?: string
  verified?: ImageVerifiedStatus
}

export type Base64EncodedImage = `data:image/jpeg;base64${string}`

export type ImageItem = {
  url: string | null
  verified: ImageVerifiedStatus | null
}
