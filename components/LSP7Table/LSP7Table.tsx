import { useContext, useEffect, useState } from 'react';

import { AssetsContext, Lsp7AssetType } from '../../contexts/AssetsContext';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import fetchLSP7Assets from '../../utils/fetchLSP7Assets';
import LSP7Card from '../LSP7Card/LSP7Card';

interface Props {
  addresses: string[];
  ownerAddress: string;
  vaultAddress?: string;
}

const LSP7Table: React.FC<Props> = ({
  addresses,
  ownerAddress,
  vaultAddress,
}) => {
  const web3Provider = useWeb3Provider();
  const [isLoading, setIsLoading] = useState(false);
  const [lsp7s, setLsp7s] = useState<Lsp7AssetType[]>([]);

  const { lsp7Assets, setLsp7Assets, setVaultsAssets, vaultsAssets } =
    useContext(AssetsContext);

  const fetchVaultAssets = async () => {
    setLsp7Assets([]);
    setIsLoading(true);
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp7Assets = await fetchLSP7Assets(
          assetAddress,
          vaultAddress as string, //checking in the useEffect
          web3Provider,
        );
        if (!lsp7Assets) {
          return;
        }
        //find vault asset
        const vaultAsset = vaultsAssets.find(
          (vaultAsset) => vaultAsset.vaultAddress === assetAddress,
        );
        if (vaultAsset) {
          //add lps7 asset to lsp7assets[] of vaultAsset
          vaultAsset.lsp7Assets.push(lsp7Assets);
          //add vault assets to vaultsAssets[]
          setVaultsAssets((prev) => [...prev, vaultAsset]);
        } else {
          //create vault asset
          const newVaultAsset = {
            vaultAddress: assetAddress,
            lsp7Assets: [lsp7Assets],
            lsp8Assets: [],
          };
          //add vault asset to vaultsAssets[]
          setVaultsAssets((prev) => [...prev, newVaultAsset]);
        }
        setLsp7s((prev) => [...prev, lsp7Assets]);

        setIsLoading(false);
      }),
    );
  };

  const fetchUPAssets = async () => {
    setLsp7Assets([]);
    setIsLoading(true);

    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp7Assets = await fetchLSP7Assets(
          assetAddress,
          ownerAddress,
          web3Provider,
        );

        if (lsp7Assets instanceof Object) {
          setLsp7s((prev) => [...prev, lsp7Assets]);
          setLsp7Assets((prev) => [...prev, lsp7Assets]);
        }
        setIsLoading(false);
      }),
    );
  };

  useEffect(() => {
    if (!web3Provider || !addresses.length) {
      return;
    }
    vaultAddress ? fetchVaultAssets() : fetchUPAssets();
  }, [web3Provider, addresses]);

  if (!lsp7Assets.length && !isLoading) {
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
              />
            );
          })}
      {!isLoading && lsp7s.length === 0 && <div>No token yet</div>}
    </div>
  );
};

export default LSP7Table;
