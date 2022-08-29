import type { NextPage } from 'next';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import erc725Schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';

import AddressError from '../../components/AddressError/AddressError';
import fetchReceivedAssets from '../../utils/fetchReceivedAssets';
import useEthersProvider from '../../hooks/useEthersProvider';
import isLSP7orLSP8 from '../../utils/isLSP7orLSP8';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import LSP7Table from '../../components/LSP7Table/LSP7Table';
import LSP8Table from '../../components/LSP8Table/LSP8Table';
import UserInfos from '../../components/UserInfos/UserInfos';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import { IPFS_GATEWAY_BASE_URL } from '../../constants';
import { LSP3Profile, LSPType } from '../../interfaces/lsps';
import { validateLSP3 } from '../../utils/validateLSP3';
import VaultsComponent from '../../components/Vaults/Vaults';

const config = { ipfsGateway: IPFS_GATEWAY_BASE_URL };

const AdressOverview: NextPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string>('');
  const [, setIsUniversalProfile] = useState<boolean>(false);
  const [isLoadingUp, setIsLoadingUp] = useState<boolean>(false);

  const [lsp3JSON, setLsp3JSON] = useState<LSP3Profile>();

  const [lsp7Addresses, setLsp7Addresses] = useState<string[]>([]);
  const [lsp8Addresses, setLsp8Addresses] = useState<string[]>([]);

  const provider = useEthersProvider() as ethers.providers.BaseProvider;

  //ERC725 does not support ethers provider
  const web3Provider = useWeb3Provider();

  const fetchAssets = async (address: string) => {
    //fetch all received assets for specific up address
    const receivedAssets = await fetchReceivedAssets(address, web3Provider);
    //loop over assets

    const lsp7AddressesTemp: string[] = [];
    const lsp8AddressesTemp: string[] = [];

    //fetch the different assets types
    await Promise.all(
      receivedAssets.map(async (assetAddress) => {
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

  const checkIsUP = async (address: string) => {
    const erc725 = new ERC725(
      erc725Schema as ERC725JSONSchema[],
      address,
      web3Provider,
      config,
    );
    try {
      setIsLoadingUp(true);
      const LSP3Profile = await erc725.fetchData(['LSP3Profile']);
      setIsUniversalProfile(true);
      const formattedLSP3 = validateLSP3(LSP3Profile[0].value);
      setLsp3JSON(formattedLSP3);
      setIsLoadingUp(false);
      await fetchAssets(address);
    } catch (error) {
      console.log(error);
      setAddressError('Address is not a Universal Profile');
      setIsUniversalProfile(false);
      setIsLoadingUp(false);
      setLsp3JSON(undefined);
    }
  };

  useEffect(() => {
    if (router.query.address) {
      setAddress(router.query.address as string);
    }
  }, [router.query.address]);

  useEffect(() => {
    if (address && web3Provider) {
      setAddressError('');
      if (!ethers.utils.isAddress(address)) {
        setAddressError('Invalid Address');
      } else {
        checkIsUP(address);
      }
    }
  }, [address, web3Provider]);

  return (
    <div className="mx-8">
      {address && <UserInfos lsp3JSON={lsp3JSON} />}
      {isLoadingUp && (
        <div className="text-5xl flex justify-center mt-20">
          Loading Universal Profile...
        </div>
      )}
      {!isLoadingUp && addressError ? (
        <AddressError message={addressError} />
      ) : (
        <div />
      )}
      <div className="mt-8">
        <div className="pb-2">
          <h2 className="px-2 border-b border-darkGray text-2xl pb-2">
            Tokens
          </h2>
          <LSP7Table addresses={lsp7Addresses} ownerAddress={address} />
        </div>
        <div className="pb-2">
          <h2 className="px-2 border-b border-darkGray text-2xl pb-2 mt-6">
            NFTs
          </h2>
          <LSP8Table addresses={lsp8Addresses} ownerAddress={address} />
        </div>
        <div className="pb-2 py-6">
          <h2 className="px-2 border-b border-darkGray text-2xl pb-2">
            Vaults
          </h2>
          <VaultsComponent ownerAddress={address} />
        </div>
      </div>
    </div>
  );
};

export default AdressOverview;
