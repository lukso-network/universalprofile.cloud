import { Repository } from 'pinia-orm'

import { type Asset, AssetModel } from '@/models/asset'
import { ImageRepository } from './image'

export class AssetRepository extends Repository<AssetModel> {
  async getOwnedTokens() {
    const { viewedProfile } = useViewedProfile()
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!viewedProfile.value?.receivedAssetAddresses) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP7DigitalAsset')
      .where('address', viewedProfile.value.receivedAssetAddresses)
      .where('chainId', selectedChainId.value)
      .where(token => {
        return token.balance !== '0'
      })
      .where('tokenType', 'TOKEN')
      .get()
  }

  async getIssuedTokens() {
    const { viewedProfile } = useViewedProfile()
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!viewedProfile.value?.issuedAssetAddresses) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP7DigitalAsset')
      .where('address', viewedProfile.value.issuedAssetAddresses)
      .where('chainId', selectedChainId.value)
      .where(token => {
        return token.balance !== '0'
      })
      .where('tokenType', 'TOKEN')
      .get()
  }

  async getOwnedNfts() {
    const { viewedProfile } = useViewedProfile()
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!viewedProfile.value?.receivedAssetAddresses) {
      return []
    }

    return this.repo(AssetModel)
      .where('address', viewedProfile.value.receivedAssetAddresses)
      .where('chainId', selectedChainId.value)
      .where('owner', viewedProfile.value.address)
      .where((asset: Asset) => {
        return asset?.tokenType === 'NFT' || asset?.tokenType === 'COLLECTION'
      })
      .where(token => {
        return token.balance !== '0'
      })
      .get()
  }

  async getIssuedNfts() {
    const { viewedProfile } = useViewedProfile()
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!viewedProfile.value?.issuedAssetAddresses) {
      return []
    }

    return this.repo(AssetModel)
      .where('address', viewedProfile.value.issuedAssetAddresses)
      .where('chainId', selectedChainId.value)
      .where('owner', viewedProfile.value.address)
      .where((asset: Asset) => {
        return asset?.tokenType === 'NFT' || asset?.tokenType === 'COLLECTION'
      })
      .where(token => {
        return token.balance !== '0'
      })
      .get()
  }

  getOwnedAssets() {
    // const { viewedProfile } = useViewedProfile()
    const { connectedProfile } = useConnectedProfile()
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!connectedProfile.value?.receivedAssetAddresses) {
      return []
    }

    return this.repo(AssetModel)
      .where('address', connectedProfile.value.receivedAssetAddresses)
      .where('chainId', selectedChainId.value)
      .where((asset: Asset) => {
        return (
          asset?.standard === 'LSP7DigitalAsset' ||
          asset?.standard === 'LSP8DigitalAsset'
        )
      })
      .where('owner', connectedProfile.value?.address)
      .get()
  }

  saveAssets(assets?: Asset[]) {
    if (!assets || !assets.length) {
      return
    }

    assets?.forEach(asset => {
      const { icon, images, creators, ...plainAsset } = asset || {}

      // save asset
      this.repo(AssetModel).save(plainAsset)

      // save asset images
      icon && this.repo(ImageModel).save(icon)
      images && images.length && this.repo(ImageModel).save(images)
      creators &&
        creators.length &&
        this.repo(CreatorRepository).saveCreators(creators)
    })
  }

  getAssetAndImages(address: Address, tokenId = '') {
    const { selectedChainId } = storeToRefs(useAppStore())
    const primaryKey = this.primaryKey(address, tokenId)
    const asset = this.repo(AssetModel)
      .where('chainId', selectedChainId.value)
      .find(primaryKey)

    if (!asset) {
      return
    }

    const icon =
      asset?.iconId && this.repo(ImageRepository).getImage(asset.iconId)
    const images =
      asset?.imageIds &&
      asset.imageIds.length &&
      this.repo(ImageRepository).getImages(asset.imageIds)

    return {
      ...asset,
      icon,
      images,
    } as Asset
  }

  setBalance(address: Address, balance: string) {
    const { selectedChainId } = storeToRefs(useAppStore())

    this.repo(AssetModel)
      .where('address', address)
      .where('chainId', selectedChainId.value)
      .update({ balance })
  }

  removeAsset(address: Address, tokenId = '') {
    const { selectedChainId } = storeToRefs(useAppStore())
    const primaryKey = this.primaryKey(address, tokenId)

    this.repo(AssetModel)
      .where('chainId', selectedChainId.value)
      .destroy(primaryKey)
  }

  private primaryKey(address: Address, tokenId = '') {
    return `["${address}","${tokenId}"]`
  }
}
