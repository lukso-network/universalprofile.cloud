import { useContext, useEffect, useState } from 'react';

import { AssetsContext, Lsp7AssetType } from '../../contexts/AssetsContext';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import fetchLSP7Assets from '../../utils/fetchLSP7Assets';
import LSP7Card from '../LSP7Card/LSP7Card';

interface Props {
  addresses: string[];
  ownerAddress: string;
  vaultAddress?: string;
  areCreatorLSP7s?: boolean;
}

const LSP7Table: React.FC<Props> = ({
  addresses,
  ownerAddress,
  areCreatorLSP7s,
}) => {
  const web3Provider = useWeb3Provider();
  const [isLoading, setIsLoading] = useState(false);
  const [lsp7s, setLsp7s] = useState<Lsp7AssetType[]>([]);

  const { setLsp7Assets, setVaultsAssets, vaultsAssets } =
    useContext(AssetsContext);

  const fetchUPAssets = async () => {
    setIsLoading(true);
    let tempLsp7s: Lsp7AssetType[] = [];
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp7Assets = await fetchLSP7Assets(
          assetAddress,
          ownerAddress,
          web3Provider,
        );
        if (!lsp7Assets) {
          return;
        }
        console.log('lsp7Assets', lsp7Assets);
        tempLsp7s = [...tempLsp7s, lsp7Assets];
        setIsLoading(false);
      }),
    );
    console.log('tempLsp7s', tempLsp7s);
    setLsp7Assets(tempLsp7s);
    setLsp7s(tempLsp7s);
  };

  const fetchCreatorAssets = async () => {
    setIsLoading(true);
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp7Assets = await fetchLSP7Assets(
          assetAddress,
          ownerAddress,
          web3Provider,
          true,
        );
        if (!lsp7Assets) {
          return;
        }
        setLsp7s((prev) => [...prev, lsp7Assets]);
      }),
    );
    setIsLoading(false);
  };

  useEffect(() => {
    setLsp7s([]);
    if (!web3Provider || !addresses.length) {
      return;
    }
    if (areCreatorLSP7s) {
      fetchCreatorAssets();
      return;
    }
    fetchUPAssets();
  }, [web3Provider, addresses]);

  if (!lsp7s.length && !isLoading) {
    return <div className="text-sm">No token yet</div>;
  }

  return (
    <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
      {isLoading
        ? 'Loading tokens metadata...'
        : lsp7s.map((asset) => {
            return (
              <LSP7Card
                key={`lsp7-${asset.address}`}
                icon={asset.icon}
                amount={asset.amount}
                name={asset.name}
                symbol={asset.symbol}
                address={asset.address}
                isCreatorLsp7={areCreatorLSP7s}
                ownerAddress={ownerAddress}
              />
            );
          })}
    </div>
  );
};

export default LSP7Table;
