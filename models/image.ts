import { Item, Model } from 'pinia-orm'

export class ImageModel extends Model {
  static entity = 'images'
  static primaryKey = 'hash'

  static fields() {
    return {
      width: this.number(0),
      height: this.number(0),
      hashFunction: this.string(''),
      hash: this.string(''),
      url: this.string(''),
      base64: this.string(''),

      // foreign keys
      profileImageId: this.attr(null),
      profileBackgroundId: this.attr(null),
    }
  }

  // types
  declare hash: string
  declare width?: number
  declare height?: number
  declare hashFunction?: string
  declare url?: string
  declare base64?: Base64EncodedImage
  declare profileImageId?: Address
  declare backgroundImageId?: Address

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.IMAGE_STORE,
    },
  }
}

export type Image = Item<ImageModel>
