import type { ImageMetadata } from '@lukso/lsp-smart-contracts'

export type Image = {
  id: string
  hash: string
  width?: number
  height?: number
  hashFunction?: string
  url?: string
  verification?: ImageMetadata['verification']
}

export type Base64EncodedImage = `data:image/jpeg;base64${string}`
