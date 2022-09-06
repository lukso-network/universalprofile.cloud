import { createContext, useState } from 'react';
import { LSPType } from '../interfaces/lsps';

export type AssetTransferInfos = {
  assetAddress: string;
  assetType: LSPType;
  amount?: number;
  tokenId?: string;
  img: string;
  ownerAddress: string; //address of the vault or the wallet
  vaultAddress?: string;
};

interface AssetTransferContextInterface {
  assetTransferInfos: AssetTransferInfos;
  setAssetTransferInfos: React.Dispatch<
    React.SetStateAction<AssetTransferInfos>
  >;
}

export const assetTransferInitialContext = {
  assetTransferInfos: {
    assetAddress: '',
    assetType: LSPType.Unknown,
    img: '',
    ownerAddress: '',
  },
  setAssetTransferInfos: () => null,
};

export const AssetTransferContext =
  createContext<AssetTransferContextInterface>(assetTransferInitialContext);

interface Props {
  children: React.ReactNode;
}

const AssetTransferProvider: React.FC<Props> = ({ children }) => {
  const [assetTransferInfos, setAssetTransferInfos] =
    useState<AssetTransferInfos>(
      assetTransferInitialContext.assetTransferInfos,
    );

  return (
    <AssetTransferContext.Provider
      value={{ assetTransferInfos, setAssetTransferInfos }}
    >
      {children}
    </AssetTransferContext.Provider>
  );
};

export default AssetTransferProvider;
