import { useContext, useEffect, useState } from 'react';
import { AssetsContext, Lsp8AssetType } from '../../contexts/AssetsContext';

import LSP8Card from '../LSP8Card/LSP8Card';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import fetchLSP8Assets from '../../utils/fetchLSP8Assets';
import fetchLSP4Metadata from '../../utils/fetchLSP4Metadata';
import { formatIntoLSP8AssetType } from '../../utils/utils';

interface Props {
  addresses: string[];
  ownerAddress: string;
  vaultAddress?: string;
  areCreatorLSP8s?: boolean;
}

const LSP8Table: React.FC<Props> = ({
  addresses,
  ownerAddress,
  vaultAddress,
  areCreatorLSP8s,
}) => {
  const web3Provider = useWeb3Provider();
  const [isLoading, setIsLoading] = useState(false);
  const [lsp8s, setLsp8s] = useState<Lsp8AssetType[]>([]);
  const { setLsp8Assets, setVaultsAssets, vaultsAssets } =
    useContext(AssetsContext);

  const fetchVaultAssets = async () => {
    setLsp8Assets([]);
    setIsLoading(true);
    let tempVaultAssets = vaultsAssets;
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp8Assets = await fetchLSP8Assets(
          assetAddress,
          vaultAddress as string, //checking in the useEffect
          web3Provider,
        );
        if (!lsp8Assets) {
          return;
        }
        if (vaultAddress) {
          //find vault asset
          const vaultAsset = tempVaultAssets.find(
            (vaultAsset) => vaultAsset.vaultAddress === vaultAddress,
          );
          if (vaultAsset) {
            vaultAsset.lsp8Assets = lsp8Assets;
          } else {
            //create vault asset
            const newVaultAsset = {
              vaultAddress,
              lsp7Assets: [],
              lsp8Assets: lsp8Assets,
            };
            tempVaultAssets = [...tempVaultAssets, newVaultAsset];
          }
        }
        setLsp8s((prev) => [...prev, ...lsp8Assets]);
      }),
    );
    setVaultsAssets((prev) => [...prev, ...tempVaultAssets]);
    setIsLoading(false);
  };

  const fetchUPAssets = async () => {
    setLsp8Assets([]);
    setIsLoading(true);
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const lsp8Assets = await fetchLSP8Assets(
          assetAddress,
          ownerAddress,
          web3Provider,
        );
        if (!lsp8Assets) {
          return;
        }
        setLsp8Assets((prev) => [...prev, ...lsp8Assets]);
        setLsp8s((prev) => [...prev, ...lsp8Assets]);
      }),
    );

    setIsLoading(false);
  };

  const fetchCreatorLSP8s = async () => {
    setLsp8Assets([]);
    setIsLoading(true);
    await Promise.all(
      addresses.map(async (assetAddress) => {
        const [collectionName, , collectionLSP4Metadata] =
          await fetchLSP4Metadata(assetAddress, web3Provider);
        const lsp8Asset = formatIntoLSP8AssetType(
          collectionName,
          collectionLSP4Metadata,
          assetAddress,
        );

        setLsp8s((prev) => [...prev, lsp8Asset]);
      }),
    );
  };

  useEffect(() => {
    setLsp8s([]);
    if (!web3Provider || !addresses.length) {
      return;
    }
    if (areCreatorLSP8s) {
      fetchCreatorLSP8s();
    }
    vaultAddress ? fetchVaultAssets() : fetchUPAssets();
  }, [web3Provider, addresses]);

  if (!lsp8s.length && !isLoading) {
    return <div className="text-sm">No NFTs yet</div>;
  }

  return (
    <>
      <div className="grid lg:grid-cols-4 lg:gap-4 md:grid-cols-2 md:gap-3">
        {isLoading
          ? 'Loading NFTs metadata...'
          : lsp8s.map((asset, index) => {
              return (
                <LSP8Card
                  key={`lsp8-${index}`}
                  assetJSON={asset}
                  ownerAddress={ownerAddress}
                  vaultAddress={vaultAddress}
                  areCreatorLSP8s={areCreatorLSP8s}
                />
              );
            })}
      </div>
    </>
  );
};

export default LSP8Table;
