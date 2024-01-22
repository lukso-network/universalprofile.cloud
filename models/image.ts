import { type Item, Model } from 'pinia-orm'

import type { ImageMetadata } from '@lukso/lsp-smart-contracts'

export class ImageModel extends Model {
  static entity = 'images'

  static fields() {
    return {
      id: this.string(''),
      width: this.number(0),
      height: this.number(0),
      hashFunction: this.string(''),
      hash: this.string(''),
      url: this.string(''),
      verification: this.attr({}),
    }
  }

  // types
  declare id: string
  declare hash: string
  declare width?: number
  declare height?: number
  declare hashFunction?: string
  declare url?: string
  declare verification?: ImageMetadata['verification']

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.IMAGE_STORE,
    },
  }
}

export type Image = Partial<Item<ImageModel>>

export type Base64EncodedImage = `data:image/jpeg;base64${string}`

export type ImageMetadataWithRelationships = Partial<ImageMetadata> & {
  profileId?: Address
  assetId?: Address
  id?: string
}
