import { Repository } from 'pinia-orm'

import { ImageModel } from '@/models/image'

export class ImageRepository extends Repository<ImageModel> {
  use = ImageModel

  getImage(id?: string) {
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!id) {
      return
    }

    const image = this.repo(ImageModel)
      .where('chainId', selectedChainId.value)
      .find(id)

    return image
  }

  getImages(ids?: string[]) {
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!ids?.length) {
      return []
    }

    const images = ids.map(id =>
      this.repo(ImageModel).where('chainId', selectedChainId.value).find(id)
    )

    return images
  }
}
