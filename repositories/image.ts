import { Repository } from 'pinia-orm'

import { ImageModel } from '@/models/image'

export class ImageRepository extends Repository<ImageModel> {
  use = ImageModel

  getImage(id?: string) {
    if (!id) {
      return
    }

    const image = this.repo(ImageModel).find(id)

    return image
  }

  getImages(ids?: string[]) {
    if (!ids?.length) {
      return []
    }

    const images = ids.map(id => this.repo(ImageModel).find(id))

    return images
  }
}
