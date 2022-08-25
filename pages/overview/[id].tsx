import type { NextPage } from 'next';
import { ethers } from 'ethers';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import erc725Schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';

import AddressError from '../../components/overview/AddressError';
import { AssetsContext } from '../../contexts/AssetsContext';
import fetchReceivedAssets from '../../utils/fetchReceivedAssets';
import useEthersProvider from '../../hooks/useEthersProvider';
import isLSP7orLSP8 from '../../utils/isLSP7orLSP8';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import LSP7Table from '../../components/overview/LSP7Table';
import LSP8Table from '../../components/overview/LSP8Table';
import UserInfos from '../../components/overview/UserInfos';
import fetchLSP8Assets from '../../utils/fetchLSP8Assets';
import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js';
import { IPFS_GATEWAY_BASE_URL } from '../../constants';
import { LSP3Profile, LSPType } from '../../interfaces/lsps';
import { validateLSP3 } from '../../utils/validateLSP3';

const config = { ipfsGateway: IPFS_GATEWAY_BASE_URL };

const AdressOverview: NextPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState<string>('');
  const [isUniversalProfile, setIsUniversalProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingUp, setIsLoadingUp] = useState<boolean>(false);

  const [lsp3JSON, setLsp3JSON] = useState<LSP3Profile>();

  const [lsp7Addresses, setLsp7Addresses] = useState<string[]>([]);

  const { lsp8Assets, setLsp8Assets } = useContext(AssetsContext);

  const provider = useEthersProvider() as ethers.providers.BaseProvider;

  //ERC725 does not support ethers provider
  const web3Provider = useWeb3Provider();

  const fetchAssets = async (address: string) => {
    //fetch all received assets for specific up address
    const receivedAssets = await fetchReceivedAssets(address, web3Provider);
    //loop over assets

    const lsp7Addresses: string[] = [];
    const lsp8Addresses: string[] = [];

    //fetch the different assets types
    await Promise.all(
      receivedAssets.map(async (assetAddress) => {
        const assetType = await isLSP7orLSP8(assetAddress, provider);

        switch (assetType) {
          case LSPType.LSP7:
            lsp7Addresses.push(assetAddress);
            break;
          case LSPType.LSP8:
            lsp8Addresses.push(assetAddress);
            break;
          default:
            break;
        }
      }),
    );

    setLsp7Addresses(lsp7Addresses);

    // TODO: refactor as above
    // fetch LSP8 assets
    await Promise.all(
      lsp8Addresses.map(async (assetAddress) => {
        const lsp8Assets = await fetchLSP8Assets(
          assetAddress,
          address,
          web3Provider,
        );
        if (lsp8Assets instanceof Object) {
          setLsp8Assets((prev) => [...prev, ...lsp8Assets]);
        }
      }),
    );

    setLoading(false);
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
    if (router.query.id) {
      setAddress(router.query.id as string);
    }
  }, [router.query.id]);

  useEffect(() => {
    setLsp8Assets([]);
    if (address && web3Provider) {
      setAddressError('');
      if (!ethers.utils.isAddress(address)) {
        setAddressError('Invalid Address');
      } else {
        setLoading(true);
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
          <h2 className="px-2 border-b border-darkGray">Tokens</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <LSP7Table addresses={lsp7Addresses} ownerAddress={address} />
          )}
        </div>
        <div className="border-b border-darkGray flex pb-2">
          <h2 className="px-2">NFTs</h2>
          {loading && <div>Loading...</div>}
          {/* {lsp8Assets.length && (
            // <LSP8Table addresses={lsp8Assets} ownerAddress={address} />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default AdressOverview;
