import { Repository } from 'pinia-orm'

import { AssetModel } from '@/models/asset'

export class AssetRepository extends Repository<AssetModel> {
  getOwnedTokens() {
    return []
    // const { viewedProfile } = useViewedProfile()
    // const { selectedChainId } = storeToRefs(useAppStore())

    // if (!viewedProfile?.value?.receivedAssetAddresses) {
    //   return []
    // }

    // return this.repo(AssetModel)
    //   .where('standard', STANDARDS.LSP7)
    //   .where('address', viewedProfile?.value.receivedAssetAddresses)
    //   .where('chainId', selectedChainId.value)
    //   .where((asset: Asset) => {
    //     return asset?.balance !== '0'
    //   })
    //   .where('tokenType', 'TOKEN')
    //   .get()
  }

  getIssuedTokens() {
    return []
    // const { viewedProfile } = useViewedProfile()
    // const { selectedChainId } = storeToRefs(useAppStore())

    // if (!viewedProfile?.value?.issuedAssetAddresses) {
    //   return []
    // }

    // return this.repo(AssetModel)
    //   .where('standard', STANDARDS.LSP7)
    //   .where('address', viewedProfile?.value.issuedAssetAddresses)
    //   .where('chainId', selectedChainId.value)
    //   .where('tokenType', 'TOKEN')
    //   .get()
  }

  getOwnedNfts() {
    return []
    // const { viewedProfile } = useViewedProfile()
    // const { selectedChainId } = storeToRefs(useAppStore())

    // if (!viewedProfile?.value?.receivedAssetAddresses) {
    //   return []
    // }

    // return this.repo(AssetModel)
    //   .where('address', viewedProfile?.value.receivedAssetAddresses)
    //   .where('chainId', selectedChainId.value)
    //   .where('owner', viewedProfile.value.address)
    //   .where((asset: Asset) => {
    //     return isCollectible(asset as TokenData)
    //   })
    //   .where((asset: Asset) => {
    //     return asset?.balance !== '0'
    //   })
    //   .get()
  }

  getIssuedNfts() {
    return []
    // const { viewedProfile } = useViewedProfile()
    // const { selectedChainId } = storeToRefs(useAppStore())

    // if (!viewedProfile?.value?.issuedAssetAddresses) {
    //   return []
    // }

    // return this.repo(AssetModel)
    //   .where('address', viewedProfile?.value.issuedAssetAddresses)
    //   .where('chainId', selectedChainId.value)
    //   .where('owner', viewedProfile.value.address)
    //   .where((asset: Asset) => {
    //     return isCollectible(asset as TokenData)
    //   })
    //   .get()
  }

  getOwnedAssets() {
    return []
    // const { connectedProfile } = useConnectedProfile()
    // const { selectedChainId } = storeToRefs(useAppStore())

    // if (!connectedProfile.value?.receivedAssetAddresses) {
    //   return []
    // }

    // return this.repo(AssetModel)
    //   .where('address', connectedProfile.value.receivedAssetAddresses)
    //   .where('chainId', selectedChainId.value)
    //   .where((asset: Asset) => {
    //     return isLsp7(asset as TokenData) || isLsp8(asset as TokenData)
    //   })
    //   .where('owner', connectedProfile.value?.address)
    //   .where((asset: Asset) => {
    //     return asset?.balance !== '0'
    //   })
    //   .get()
  }

  saveAssets(_assets?: Asset[]) {
    // if (!assets || !assets.length) {
    //   return
    // }
    // this.repo(AssetModel).save(assets)
  }

  getAsset(address: Address, _tokenId = '') {
    // const { selectedChainId } = storeToRefs(useAppStore())
    // const primaryKey = this.primaryKey(address, tokenId)
    // const asset = this.repo(AssetModel)
    //   .where('chainId', selectedChainId.value)
    //   .find(primaryKey)
    // if (!asset) {
    //   return
    // }
    // return asset
  }

  setBalance(_address: Address, _balance: string) {
    // const { selectedChainId } = storeToRefs(useAppStore())
    // this.repo(AssetModel)
    //   .where('address', address)
    //   .where('chainId', selectedChainId.value)
    //   .update({ balance })
  }

  removeAsset(address: Address, _tokenId = '') {
    // const { selectedChainId } = storeToRefs(useAppStore())
    // const primaryKey = this.primaryKey(address, tokenId)
    // this.repo(AssetModel)
    //   .where('chainId', selectedChainId.value)
    //   .destroy(primaryKey)
  }

  private primaryKey(address: Address, tokenId = '') {
    return `["${address}","${tokenId}"]`
  }
}
