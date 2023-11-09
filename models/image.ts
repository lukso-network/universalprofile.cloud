import { Item } from 'pinia-orm'
import { ImageMetadata } from '@lukso/lsp-smart-contracts'

import { BaseModel } from '@/models/base'

export class ImageModel extends BaseModel {
  static entity = 'images'

  static fields() {
    return {
      ...super.fields(),
      id: this.string(''),
      width: this.number(0),
      height: this.number(0),
      hashFunction: this.string(''),
      hash: this.string(''),
      url: this.string(''),
      base64: this.string(''),
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
  declare base64?: Base64EncodedImage
  declare verification?: ImageMetadata['verification']

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.IMAGE_STORE,
    },
  }
}

export type Image = Partial<Item<ImageModel>>
