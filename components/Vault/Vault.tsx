import LSP7Table from '../LSP7Table/LSP7Table';
import LSP8Table from '../LSP8Table/LSP8Table';
import { useState, useEffect } from 'react';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import useEthersProvider from '../../hooks/useEthersProvider';
import fetchReceivedAssets from '../../utils/fetchReceivedAssets';
import { ethers } from 'ethers';
import getAssets from '../../utils/getAssets';

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

    const { lsp7Addresses, lsp8Addresses } = await getAssets(
      receivedAssets,
      ethersProvider,
    );

    setLsp7Addresses(lsp7Addresses);
    setLsp8Addresses(lsp8Addresses);
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

  if (!lsp7Addresses.length && !lsp8Addresses.length) {
    return <div>No Assets in Vault {vaultIndex}</div>;
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
