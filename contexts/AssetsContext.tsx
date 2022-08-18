import { createContext, useState } from 'react';
import { Image } from '../interfaces/lsps';

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

interface AssetsContextInterface {
  lsp7Assets: Lsp7AssetType[];
  setLsp7Assets: React.Dispatch<React.SetStateAction<Lsp7AssetType[]>>;
  lsp8Assets: Lsp8AssetType[];
  setLsp8Assets: React.Dispatch<React.SetStateAction<Lsp8AssetType[]>>;
}

const initalContext = {
  lsp7Assets: [],
  setLsp7Assets: () => [],
  lsp8Assets: [],
  setLsp8Assets: () => [],
};

export const AssetsContext =
  createContext<AssetsContextInterface>(initalContext);

interface Props {
  children: React.ReactNode;
}

const AssetsProvider: React.FC<Props> = ({ children }) => {
  const [lsp7Assets, setLsp7Assets] = useState<Lsp7AssetType[]>([]);
  const [lsp8Assets, setLsp8Assets] = useState<Lsp8AssetType[]>([]);

  return (
    <AssetsContext.Provider
      value={{ lsp7Assets, setLsp7Assets, lsp8Assets, setLsp8Assets }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

export default AssetsProvider;
