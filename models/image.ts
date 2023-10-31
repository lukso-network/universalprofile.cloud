import { Item } from 'pinia-orm'

import { BaseModel } from '@/models/base'

export class ImageModel extends BaseModel {
  static entity = 'images'
  static primaryKey = 'hash'

  static fields() {
    return {
      ...super.fields(),
      width: this.number(0),
      height: this.number(0),
      hashFunction: this.string(''),
      hash: this.string(''),
      url: this.string(''),
      base64: this.string(''),
    }
  }

  // types
  declare hash: string
  declare width?: number
  declare height?: number
  declare hashFunction?: string
  declare url?: string
  declare base64?: Base64EncodedImage

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.IMAGE_STORE,
    },
  }
}

export type Image = Partial<Item<ImageModel>>
