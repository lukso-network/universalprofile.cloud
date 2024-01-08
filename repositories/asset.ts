import { Repository } from 'pinia-orm'

import { type Asset, AssetModel } from '@/models/asset'
import { ImageRepository } from './image'

import type { DecodeDataOutput } from '@erc725/erc725.js/build/main/src/types/decodeData'
import type { InterfaceId } from '@/types/assets'

export class AssetRepository extends Repository<AssetModel> {
  async loadAssets(addresses: Address[], profileAddress: Address) {
    const { selectedChainId } = storeToRefs(useAppStore())

    await Promise.all(
      addresses.map(async assetAddress => {
        // we might get multiple assets since LSP8 share same contract
        const [storageAsset] = this.repo(AssetModel)
          .where('address', assetAddress)
          .where('chainId', selectedChainId.value)
          .get()

        if (storageAsset) {
          let assetData: DecodeDataOutput | undefined = undefined

          if (storageAsset.standard === 'LSP7DigitalAsset') {
            // asynchronously fetch token balances
            fetchLsp7Balance(assetAddress, profileAddress).then(balance => {
              this.setBalance(assetAddress, balance)
            })

            assetData = await fetchLsp4Data(assetAddress)

            // check if asset metadata has changed
            if (getHash(assetData?.value) === getHash(storageAsset)) {
              return
            }
          }

          // TODO investigate if LSP8 can be checked for changes or use Algolia API instead
          // if (storageAsset.standard === 'LSP8IdentifiableDigitalAsset') {
          //   assetData = await getLsp8Data(assetAddress)
          // }
        }

        const fetchedAsset = await fetchAsset(assetAddress, profileAddress)

        if (fetchedAsset?.length) {
          fetchedAsset && fetchedAsset.length && this.saveAssets(fetchedAsset)
        } else {
          console.warn('Asset not found', assetAddress)
          // we store the asset although it can't be detected so we don't repeat interface check
          this.saveAssets([
            {
              address: assetAddress,
              tokenId: '',
            },
          ])
        }
      })
    )
  }

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
      .get()
  }

  async getOwnedNfts() {
    const { viewedProfile } = useViewedProfile()
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!viewedProfile.value?.receivedAssetAddresses) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP8IdentifiableDigitalAsset')
      .where('address', viewedProfile.value.receivedAssetAddresses)
      .where('chainId', selectedChainId.value)
      .where('owner', viewedProfile.value.address)
      .get()
  }

  async getIssuedNfts() {
    const { viewedProfile } = useViewedProfile()
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!viewedProfile.value?.issuedAssetAddresses) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP8IdentifiableDigitalAsset')
      .where('address', viewedProfile.value.issuedAssetAddresses)
      .where('chainId', selectedChainId.value)
      .where('owner', viewedProfile.value.address)
      .get()
  }

  getOwnedAssets() {
    const { viewedProfile } = useViewedProfile()
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!viewedProfile.value?.receivedAssetAddresses) {
      return []
    }

    return this.repo(AssetModel)
      .where('address', viewedProfile.value.receivedAssetAddresses)
      .where('standard', (standard: InterfaceId) => standard)
      .where('chainId', selectedChainId.value)
      .where((asset: Asset) => {
        return (
          asset?.standard === 'LSP7DigitalAsset' ||
          (asset?.standard === 'LSP8IdentifiableDigitalAsset' &&
            asset?.owner === viewedProfile.value?.address)
        )
      })
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
      creators && creators.length && this.repo(CreatorModel).save(creators)
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
