import fetchLSP4Metadata from './fetchLSP4Metadata';
import { RPC_URL, luksoImg } from '../constants';
import { Lsp8AssetType } from '../contexts/AssetsContext';
import Web3 from 'web3';
import LSP8DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json';
import { ethers } from 'ethers';
import { validateLSP4MetaData } from './validateLSP4Metdata';
import ERC725, { ERC725JSONSchema } from '@erc725/erc725.js';
import { LSP4Metadata } from '../interfaces/lsps';
import { IPFS_GATEWAY_BASE_URL } from '../constants';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import LSP8IdentifiableDigitalAssetSchema from '../schemas/LSP8IdentifiableDigitalAssetSchema.json';

enum TokenIdType {
  address = '1',
  number = '2',
  bytes32 = '3',
}

const fetchLSP8Assets = async (
  assetAddress: string,
  UPAddress: string,
  web3Provider: any,
): Promise<Lsp8AssetType[] | undefined> => {
  const tokensIds = await fetchLSP8TokensIds(assetAddress, UPAddress);

  if (!tokensIds.length) {
    return;
  }

  const [collectionName, collectionSymbol, collectionLSP4Metadata] =
    await fetchLSP4Metadata(assetAddress, web3Provider);

  const newLSP8Assets: Lsp8AssetType[] = [];

  await Promise.all(
    tokensIds.map(async (tokenId) => {
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
      newLSP8Assets.push(lsp8AssetObject);
    }),
  );
  return newLSP8Assets;
};

const fetchLSP8TokensIds = async (
  contractAddress: string,
  UPAddress: string,
): Promise<string[]> => {
  const web3 = new Web3(RPC_URL);

  const lsp8Contract = new web3.eth.Contract(
    LSP8DigitalAsset.abi as any,
    contractAddress,
  );

  const tokensIds = (await lsp8Contract.methods
    .tokenIdsOf(UPAddress)
    .call()) as string[];
  return tokensIds;
};

const createLSP8Object = (
  NFTLSP4MetadataJSON: LSP4Metadata,
  tokenId: string,
  collectionName: string,
  collectionSymbol: string,
  assetAddress: string,
  collectionLSP4Metadata: LSP4Metadata,
): Lsp8AssetType => {
  const { description, images, icons } = NFTLSP4MetadataJSON.LSP4Metadata;

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

const fetchLSP8Metadata = async (
  tokenId: string,
  address: string,
  provider: any,
): Promise<LSP4Metadata> => {
  const options = {
    ipfsGateway: IPFS_GATEWAY_BASE_URL,
  };

  const erc725Asset = new ERC725(
    LSP8IdentifiableDigitalAssetSchema.concat(
      LSP4DigitalAssetSchema,
    ) as ERC725JSONSchema[],
    address,
    provider,
    options,
  );

  const LSP8MetadataGetter = async (
    tokenIdType: string,
    tokenId: string,
  ): Promise<LSP4Metadata> => {
    const LSP8Metadata = await erc725Asset.fetchData([
      {
        keyName: `LSP8MetadataJSON:<${tokenIdType}>`,
        dynamicKeyParts: tokenId,
      },
    ]);
    return validateLSP4MetaData(LSP8Metadata[0].value);
  };

  try {
    //fetch tokenIdType
    const tokenIdTypeData = await erc725Asset.fetchData(['LSP8TokenIdType']);

    const tokenIdType = tokenIdTypeData[0].value.toString();

    //fetch LSP8MetadataJSON depending on tokenIdType
    if (tokenIdType === TokenIdType.address) {
      return LSP8MetadataGetter(
        'address',
        ethers.utils.hexDataSlice(tokenId.toString(), 12),
      );
    } else if (tokenIdType === TokenIdType.number) {
      return LSP8MetadataGetter('uint256', parseInt(tokenId).toString());
    } else if (tokenIdType === TokenIdType.bytes32) {
      return LSP8MetadataGetter('bytes32', tokenId.toString());
    } else {
      return {
        LSP4Metadata: {
          description: '',
          links: [],
          images: [[]],
          icons: [],
          assets: [],
        },
      };
    }
  } catch (error) {
    console.log(error);
    return {
      LSP4Metadata: {
        description: '',
        links: [],
        images: [[]],
        icons: [],
        assets: [],
      },
    };
  }
};

export default fetchLSP8Assets;
