import { Lsp8AssetType } from '../contexts/AssetsContext';
import { LSP4Metadata } from '../interfaces/lsps';

export const firstTwoBytesOfAddress = (address: string) => {
  if (address) {
    return address.slice(2, 6);
  }
};

export const formatIntoLSP8AssetType = (
  collectionName: string,
  collectionLSP4Metadata: LSP4Metadata,
  collectionAddress: string,
): Lsp8AssetType => {
  const lsp8AssetObject: Lsp8AssetType = {
    icon: collectionLSP4Metadata.LSP4Metadata.icons[0]?.url,
    image: collectionLSP4Metadata.LSP4Metadata.images[0][0]?.url,
    tokenId: '',
    description: collectionLSP4Metadata.LSP4Metadata.description,
    collectionName: collectionName,
    collectionDescription: collectionLSP4Metadata.LSP4Metadata.description,
    collectionImage: collectionLSP4Metadata.LSP4Metadata.icons[0]?.url,
    collectionIcon: collectionLSP4Metadata.LSP4Metadata.images[0][0]?.url,
    collectionAddress: collectionAddress,
  };
  return lsp8AssetObject;
};
