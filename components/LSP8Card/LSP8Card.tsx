import { useContext } from 'react';

import { AssetTransferContext } from '../../contexts/AssetTransferContext';
import { WalletAddressContext } from '../../contexts/WalletAddressContext';
import { LSPType } from '../../interfaces/lsps';

interface Props {
  assetJSON: {
    icon: string;
    image: string;
    tokenId: string;
    description: string;
    collectionName: string;
    collectionDescription: string;
    collectionImage: string;
    collectionIcon: string;
    collectionAddress: string;
  };
  ownerAddress: string;
  vaultAddress?: string;
  areCreatorLSP8s?: boolean;
}

const LSP8Card: React.FC<Props> = ({
  assetJSON,
  ownerAddress,
  vaultAddress,
  areCreatorLSP8s,
}) => {
  const { setAssetTransferInfos } = useContext(AssetTransferContext);
  const { walletAddress } = useContext(WalletAddressContext);

  const isAssetTransferable = () => {
    if (!areCreatorLSP8s && ownerAddress === walletAddress) {
      return true;
    }
  };

  return (
    <div className="border border-darkGray p-3 rounded-lg h-[320px] mt-8">
      <div className="rounded h-[180px] overflow-hidden mb-2">
        <img
          src={assetJSON.image}
          alt="nft-image"
          className="object-none rounded w-full h-full bg-cover bg-repeat bg-center"
        />
      </div>
      <div className="text-xs font-bold text-gray-600 leading-6">
        {assetJSON.collectionName}
      </div>
      {assetJSON.tokenId && (
        <div className="text-sm leading-6">#{parseInt(assetJSON.tokenId)}</div>
      )}
      {isAssetTransferable() && (
        <div className="flex justify-end">
          <button
            className="mt-2 border border-red-400 py-1 px-2 text-red-400 rounded"
            onClick={() =>
              setAssetTransferInfos({
                assetAddress: assetJSON.collectionAddress,
                tokenId: assetJSON.tokenId,
                assetType: LSPType.LSP8,
                img: assetJSON.image,
                ownerAddress,
                vaultAddress,
              })
            }
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default LSP8Card;
