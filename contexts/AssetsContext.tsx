import { createContext, useState } from 'react';

export type Lsp7AssetType = {
  name: string;
  symbol: string;
  icon: string;
  amount: number;
  address: string;
};

export type Lsp8AssetType = {
  image: string;
  icon: string;
  tokenId: string;
  description: string;
  collectionName: string;
  collectionDescription: string;
  collectionImage: string;
  collectionIcon: string;
  collectionAddress: string;
};

export type VaultsAssetsType = {
  lsp7Assets: Lsp7AssetType[];
  lsp8Assets: Lsp8AssetType[];
  vaultAddress: string;
};

interface AssetsContextInterface {
  lsp7Assets: Lsp7AssetType[];
  setLsp7Assets: React.Dispatch<React.SetStateAction<Lsp7AssetType[]>>;
  lsp8Assets: Lsp8AssetType[];
  setLsp8Assets: React.Dispatch<React.SetStateAction<Lsp8AssetType[]>>;
  vaultsAssets: VaultsAssetsType[];
  setVaultsAssets: React.Dispatch<React.SetStateAction<VaultsAssetsType[]>>;
}

const initalContext = {
  lsp7Assets: [],
  setLsp7Assets: () => [],
  lsp8Assets: [],
  setLsp8Assets: () => [],
  vaultsAssets: [],
  setVaultsAssets: () => [],
};

export const AssetsContext =
  createContext<AssetsContextInterface>(initalContext);

interface Props {
  children: React.ReactNode;
}

const AssetsProvider: React.FC<Props> = ({ children }) => {
  const [lsp7Assets, setLsp7Assets] = useState<Lsp7AssetType[]>([]);
  const [lsp8Assets, setLsp8Assets] = useState<Lsp8AssetType[]>([]);

  const [vaultsAssets, setVaultsAssets] = useState<VaultsAssetsType[]>([]);

  return (
    <AssetsContext.Provider
      value={{
        lsp7Assets,
        setLsp7Assets,
        lsp8Assets,
        setLsp8Assets,
        vaultsAssets,
        setVaultsAssets,
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export default AssetsProvider;
