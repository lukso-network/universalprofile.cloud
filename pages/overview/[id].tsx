import type { NextPage } from 'next';
import { ethers } from 'ethers';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import AddressError from '../../components/overview/AddressError';
import { AssetsContext } from '../../contexts/AssetsContext';
import fetchReceivedAssets from '../../utils/fetchReceivedAssets';
import useEthersProvider from '../../hooks/useEthersProvider';
import isLSP7orLSP8 from '../../utils/isLSP7orLSP8';
import fetchLSP4Metadata from '../../utils/fetchLSP4Metadata';
import fetchLSP7Balance from '../../utils/fetchLSP7Balance';
import fetchLSP8Metadata from '../../utils/fetchLSP8Metadata';
import fetchLSP8TokensIds from '../../utils/fetchLSP8TokensIds';
import isUP from '../../utils/isUP';
import useWeb3Provider from '../../hooks/useWeb3Provider';
import { Lsp7AssetType, Lsp8AssetType } from '../../contexts/AssetsContext';
import LSP7Table from '../../components/overview/LSP7sTable';
import LSP8Table from '../../components/overview/LSP8Table';
import { luksoImg } from '../../constants';
import { LSP4Metadata } from '../../interfaces/lsps';

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

  const createLSP8Object = (
    NFTLSP4MetadataJSON: LSP4Metadata,
    tokenId: string,
    collectionName: string,
    collectionSymbol: string,
    assetAddress: string,
    collectionLSP4Metadata: LSP4Metadata,
  ): Lsp8AssetType => {
    const { description, links, images, assets, icons } =
      NFTLSP4MetadataJSON.LSP4Metadata;

    const lsp8AssetObject = {
      tokenId,
      description,
      image: images[0][0]?.url ? images[0][0].url : luksoImg,
      icon: icons[0]?.url ? icons[0].url : luksoImg,
      collectionName,
      collectionSymbol,
      collectionAddress: assetAddress,
      collectionDescription: collectionLSP4Metadata.LSP4Metadata.description,
      collectionImage: collectionLSP4Metadata.LSP4Metadata.images[0][0]?.url
        ? collectionLSP4Metadata.LSP4Metadata.images[0][0]?.url
        : luksoImg,
      collectionIcon: collectionLSP4Metadata.LSP4Metadata.icons[0]?.url
        ? collectionLSP4Metadata.LSP4Metadata.icons[0]?.url
        : luksoImg,
    };
    return lsp8AssetObject as Lsp8AssetType;
  };

  const getAssets = async (address: string) => {
    //fetch all received assets for specific up address
    const receivedAssets = await fetchReceivedAssets(address, web3Provider);
    //loop over assets
    for await (const assetAddress of receivedAssets) {
      //figure out if asset is LSP7 or LSP8
      const assetType = await isLSP7orLSP8(assetAddress, provider);
      //if LSP7 then fetch LSP7 assets
      if (assetType === 'LSP7') {
        const LSP4MetadataResponse = await fetchLSP4Metadata(
          assetAddress,
          web3Provider,
        );

        //fetch amount of tokens received
        const tokenBalance = await fetchLSP7Balance(
          assetAddress,
          address,
          provider,
        );

        if (tokenBalance > 0) {
          //not uses LSP4Metada at the moment but might depending on what we want to dispaly
          let [LSP4TokenName, LSP4TokenSymbol, LSP4MetadataJSON] =
            LSP4MetadataResponse;
          const lsp7AssetObject = {
            name: LSP4TokenName,
            symbol: LSP4TokenSymbol,
            amount: tokenBalance,
            icon: LSP4MetadataJSON.LSP4Metadata.icons[0]?.url
              ? LSP4MetadataJSON.LSP4Metadata.icons[0]?.url
              : luksoImg,
            address: assetAddress,
          };

          setLsp7Assets((prev: Lsp7AssetType[]): Lsp7AssetType[] => [
            ...prev,
            lsp7AssetObject,
          ]);
        }
      } else if (assetType === 'LSP8') {
        //if LSP8 then fetch address tokensIds
        const tokensIds = await fetchLSP8TokensIds(
          assetAddress,
          address,
          provider,
        );

        const [collectionName, collectionSymbol, collectionLSP4Metadata] =
          await fetchLSP4Metadata(assetAddress, web3Provider);

        if (tokensIds.length) {
          //loop over tokensIds and fetch LSP8Metadata for each tokenId
          for await (const tokenId of tokensIds) {
            const NFTLSP4MetadataJSON = await fetchLSP8Metadata(
              tokenId,
              assetAddress,
              web3Provider,
            );

            const lsp8AssetObject: Lsp8AssetType = createLSP8Object(
              NFTLSP4MetadataJSON,
              tokenId,
              collectionName,
              collectionSymbol,
              assetAddress,
              collectionLSP4Metadata,
            );

            setLsp8Assets((prev: Lsp8AssetType[]): Lsp8AssetType[] => [
              ...prev,
              lsp8AssetObject,
            ]);
          }
        }
      }
    }
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
    if (address) {
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
    <>
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
        <div className="px-4 mt-8">
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
    </>
  );
};

export default AdressOverview;
