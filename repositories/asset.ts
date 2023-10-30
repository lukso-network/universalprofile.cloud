import { Repository } from 'pinia-orm'

import { Asset, AssetModel } from '@/models/asset'

export class AssetRepository extends Repository<AssetModel> {
  async loadAssets(addresses: Address[], profileAddress: Address) {
    await Promise.all(
      addresses.map(async assetAddress => {
        const storageAsset = this.repo(AssetModel).find(assetAddress)

        if (storageAsset) {
          // fetch token balances every time
          if (storageAsset.standard === 'LSP7DigitalAsset') {
            const balance = await fetchLsp7Balance(assetAddress, profileAddress)
            this.setBalance(assetAddress, balance)
          }

          return
        }

        const fetchedAsset = await fetchAsset(assetAddress)

        if (fetchedAsset?.length) {
          fetchedAsset && fetchedAsset.length && this.saveAssets(fetchedAsset)
        } else {
          console.warn('Asset not found', assetAddress)
        }
      })
    )
  }

  async getOwnedTokens() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.receivedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP7DigitalAsset')
      .find(viewedProfile.value.receivedAssetIds)
  }

  async getIssuedTokens() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.issuedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP7DigitalAsset')
      .find(viewedProfile.value.issuedAssetIds)
  }

  async getOwnedNfts() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.receivedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP8IdentifiableDigitalAsset')
      .find(viewedProfile.value.receivedAssetIds)
  }

  async getIssuedNfts() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.issuedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP8IdentifiableDigitalAsset')
      .find(viewedProfile.value.issuedAssetIds)
  }

  getOwnedAssets() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.receivedAssetIds) {
      return []
    }

    return this.repo(AssetModel).find(viewedProfile.value.receivedAssetIds)
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
      creators && creators.length && this.repo(CreatorModel).save(creators)
    })
  }

  getAssetAndImages(address: Address, tokenId?: string) {
    let asset: Asset

    if (tokenId) {
      asset = this.repo(AssetModel).where('tokenId', tokenId).find(address)
    } else {
      asset = this.repo(AssetModel).find(address)
    }

    const icon = asset?.iconId && this.repo(ImageModel).find(asset.iconId)
    const images =
      asset?.imageIds &&
      asset.imageIds.length &&
      this.repo(ImageModel).find(asset.imageIds)

    return {
      ...asset,
      icon,
      images,
    } as Asset
  }

  setBalance(address: Address, balance: string) {
    this.repo(AssetModel).where('address', address).update({ balance })
  }
}
