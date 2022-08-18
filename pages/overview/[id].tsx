import type { NextPage } from 'next';
import { ethers } from 'ethers';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import AddressError from '../../components/overview/AddressError';
import { AssetsContext } from '../../contexts/AssetsContext';
import fetchReceivedAssets from '../../utils/fetchReceivedAssets';
import useEthersProvider from '../../hooks/useEthersProvider';
import isLSP7orLSP8 from '../../utils/isLSP7orLSP8';
import isUP from '../../utils/isUP';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import LSP7Table from '../../components/overview/LSP7sTable';
import LSP8Table from '../../components/overview/LSP8Table';
import UserInfos from '../../components/overview/UserInfos';
import fetchLSP7Assets from '../../utils/fetchLSP7Assets';
import fetchLSP8Assets from '../../utils/fetchLSP8Assets';

const AdressOverview: NextPage = () => {
  const router = useRouter();
  const [addressError, setAddressError] = useState<string>('');
  const [isUniversalProfile, setIsUniversalProfile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [showLSP7, setShowLSP7] = useState<boolean>(true);

  const { lsp7Assets, setLsp7Assets, lsp8Assets, setLsp8Assets } =
    useContext(AssetsContext);
  const provider = useEthersProvider() as ethers.providers.BaseProvider;

  //ERC725 does not support ethers provider
  const web3Provider = useWeb3Provider();

  const getAssets = async (address: string) => {
    //fetch all received assets for specific up address
    const receivedAssets = await fetchReceivedAssets(address, web3Provider);
    //loop over assets

    const lsp7Assets: string[] = [];
    const lsp8Assets: string[] = [];

    //fetch the different assets types
    await Promise.all(
      receivedAssets.map(async (assetAddress) => {
        const assetType = await isLSP7orLSP8(assetAddress, provider);
        if (assetType === 'LSP7') {
          lsp7Assets.push(assetAddress);
        }
        if (assetType === 'LSP8') {
          lsp8Assets.push(assetAddress);
        }
      }),
    );

    //fetch LSP7 assets
    await Promise.all(
      lsp7Assets.map(async (assetAddress) => {
        const lsp7Assets = await fetchLSP7Assets(
          assetAddress,
          address,
          web3Provider,
        );
        if (lsp7Assets instanceof Object) {
          setLsp7Assets((prev) => [...prev, lsp7Assets]);
        }
      }),
    );

    //fetch LSP8 assets
    await Promise.all(
      lsp8Assets.map(async (assetAddress) => {
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

  const checkIsUp = async (address: string) => {
    const isUPResult = await isUP(address, web3Provider);
    if (!isUPResult) {
      setLoading(false);
      setAddressError('Address is not a Universal Profile');
    }
    setIsUniversalProfile(true);
  };

  useEffect(() => {
    const address = router.query.id as string;
    console.log('inside router', address);
    if (address) {
      setAddressError('');
      if (!ethers.utils.isAddress(address)) {
        setAddressError('Invalid Address');
        return;
      } else {
        setLoading(true);
        //check if address is UP
        checkIsUp(address);
      }
    }
  }, [router]);

  useEffect(() => {
    const address = router.query.id as string;
    if (isUniversalProfile && address) {
      getAssets(address);
    }
  }, [isUniversalProfile, router]);

  return (
    <div className="mx-8">
      {typeof router.query.id == 'string' && (
        <UserInfos userAddress={router.query.id} />
      )}
      {loading && (
        <div className="text-5xl flex justify-center mt-20">Loading...</div>
      )}
      {addressError && !loading ? (
        <AddressError message={addressError} />
      ) : (
        <div />
      )}
      {isUniversalProfile &&
      !loading &&
      (lsp7Assets.length || lsp8Assets.length) ? (
        <div className="mt-8">
          <div className="border-b border-darkGray flex pb-2">
            <div
              className={`px-2 cursor-pointer ${showLSP7 && 'text-blue-500'}`}
              onClick={() => setShowLSP7(true)}
            >
              Tokens
            </div>
            <div
              onClick={() => setShowLSP7(false)}
              className={`px-2 cursor-pointer ${!showLSP7 && 'text-blue-500'}`}
            >
              NFTs
            </div>
          </div>
          {<>{showLSP7 ? <LSP7Table /> : <LSP8Table />}</>}
        </div>
      ) : (
        <div />
      )}
      {isUniversalProfile &&
      !loading &&
      !(lsp7Assets.length || lsp8Assets.length) ? (
        <div className="text-xl">No assets received yet</div>
      ) : (
        <div />
      )}
    </div>
  );
};

export default AdressOverview;
