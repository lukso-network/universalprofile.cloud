import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import useEthersProvider from '../../hooks/useEthersProvider';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import isLSP7orLSP8 from '../../utils/isLSP7orLSP8';
import { LSPType } from '../../interfaces/lsps';
import LSP7Table from '../../components/LSP7Table/LSP7Table';
import LSP8Table from '../../components/LSP8Table/LSP8Table';
import fetchIssuedAssets from '../../utils/fetchIssuedAssets';

interface IProps {
  isUniversalProfile: boolean;
  ownerAddress: string;
}

const CreatedAssets: React.FC<IProps> = ({
  isUniversalProfile,
  ownerAddress,
}) => {
  const [lsp7Addresses, setLsp7Addresses] = useState<string[]>([]);
  const [lsp8Addresses, setLsp8Addresses] = useState<string[]>([]);

  const provider = useEthersProvider() as ethers.providers.BaseProvider;

  //ERC725 does not support ethers provider
  const web3Provider = useWeb3Provider();

  const fetchCreatedAssets = async () => {
    //fetch all received assets for specific up address
    const issuedAssets = await fetchIssuedAssets(web3Provider, ownerAddress);

    const lsp7AddressesTemp: string[] = [];
    const lsp8AddressesTemp: string[] = [];

    //fetch the different assets types
    await Promise.all(
      issuedAssets.map(async (assetAddress) => {
        const assetType = await isLSP7orLSP8(assetAddress, provider);
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
  };

  useEffect(() => {
    isUniversalProfile && fetchCreatedAssets();
  }, [isUniversalProfile, ownerAddress]);
  return (
    <div>
      <div className="text-5xl text-center py-10">Created Assets</div>
      <div className="pb-2">
        <h2 className="px-2 border-b border-darkGray text-2xl pb-2">Tokens</h2>
        <LSP7Table
          addresses={lsp7Addresses}
          ownerAddress={ownerAddress}
          areCreatorLSP7s={true}
        />
      </div>
      <div className="pb-2">
        <h2 className="px-2 border-b border-darkGray text-2xl pb-2 mt-6">
          NFTs
        </h2>
        <LSP8Table
          addresses={lsp8Addresses}
          ownerAddress={ownerAddress}
          areCreatorLSP8s={true}
        />
      </div>
    </div>
  );
};

export default CreatedAssets;
