import { Model } from 'pinia-orm'

export class BaseModel extends Model {
  static fields() {
    return {
      chainId: this.attr(null),
    }
  }

  declare chainId?: string

  static creating(model: Model) {
    const { selectedChainId } = storeToRefs(useAppStore())
    model.chainId = selectedChainId.value
  }
}
