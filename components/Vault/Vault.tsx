import LSP7Table from '../LSP7Table/LSP7Table';
import LSP8Table from '../LSP8Table/LSP8Table';
import { useState, useEffect } from 'react';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import useEthersProvider from '../../hooks/useEthersProvider';
import fetchReceivedAssets from '../../utils/fetchReceivedAssets';
import isLSP7orLSP8 from '../../utils/isLSP7orLSP8';
import { ethers } from 'ethers';
import { LSPType } from '../../interfaces/lsps';

interface Props {
  ownerAddress: string;
  vaultAddress: string;
  vaultIndex: number;
}

const Vault: React.FC<Props> = ({ ownerAddress, vaultAddress, vaultIndex }) => {
  const web3Provider = useWeb3Provider();
  const ethersProvider = useEthersProvider() as ethers.providers.BaseProvider;
  const [lsp7Addresses, setLsp7Addresses] = useState<string[]>([]);
  const [lsp8Addresses, setLsp8Addresses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAssets = async (vaultAddress: string) => {
    //fetch all received assets for specific up address
    const receivedAssets = await fetchReceivedAssets(
      vaultAddress,
      web3Provider,
    );

    if (!receivedAssets.length) {
      setIsLoading(false);
      return;
    }

    const lsp7AddressesTemp: string[] = [];
    const lsp8AddressesTemp: string[] = [];

    //fetch the different assets types
    await Promise.all(
      receivedAssets.map(async (assetAddress) => {
        const assetType = await isLSP7orLSP8(assetAddress, ethersProvider);
        switch (assetType) {
          case LSPType.LSP7:
            lsp7AddressesTemp.push(assetAddress);
            break;
          case LSPType.LSP8:
            lsp8AddressesTemp.push(assetAddress);
            break;
          default:
            break;
        }
      }),
    );
    setLsp7Addresses(lsp7AddressesTemp);
    setLsp8Addresses(lsp8AddressesTemp);
    setIsLoading(false);
  };

  useEffect(() => {
    if (vaultAddress && web3Provider) {
      fetchAssets(vaultAddress);
    }
  }, [vaultAddress, web3Provider]);

  if (isLoading) {
    return <div>Loading Vault {vaultIndex}...</div>;
  }
  return (
    <>
      <h1 className="text-xl mt-3">Vault {vaultIndex}</h1>
      <div>
        <h2 className="text-base mt-3 mb-2">Tokens</h2>
        <LSP7Table
          ownerAddress={ownerAddress}
          vaultAddress={vaultAddress}
          addresses={lsp7Addresses}
        />
      </div>
      <div>
        <h2 className="text-base mt-6 mb-2">NFTs</h2>
        <LSP8Table
          ownerAddress={ownerAddress}
          vaultAddress={vaultAddress}
          addresses={lsp8Addresses}
        />
      </div>
    </>
  );
};

export default Vault;
