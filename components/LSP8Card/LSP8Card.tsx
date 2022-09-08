import { useContext, useState } from 'react';

import { WalletAddressContext } from '../../contexts/WalletAddressContext';
import { LSPType } from '../../interfaces/lsps';
import AssetTransferModal from '../AssetTransferModal';

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
}

const LSP8Card: React.FC<Props> = ({
  assetJSON,
  ownerAddress,
  vaultAddress,
  areCreatorLSP8s,
}) => {
  const { walletAddress } = useContext(WalletAddressContext);

  const [isTransferModalOpen, setIsTransferModalOpen] =
    useState<boolean>(false);

  const isAssetTransferable = () => {
    if (!areCreatorLSP8s && ownerAddress === walletAddress) {
      return true;
    }
  };

  return (
    <div className="border border-darkGray p-3 rounded-lg h-[280px] mt-8">
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
            onClick={() => setIsTransferModalOpen(true)}
          >
            Send
          </button>
        </div>
      )}
      {isTransferModalOpen && (
        <AssetTransferModal
          vaultAddress={vaultAddress}
          setIsTransferModalOpen={setIsTransferModalOpen}
          assetType={LSPType.LSP8}
          assetAddress={assetJSON.collectionAddress}
          tokenId={assetJSON.tokenId}
          assetImage={assetJSON.image}
          ownerAddress={ownerAddress}
        />
      )}
    </div>
  );
};

export default LSP8Card;
