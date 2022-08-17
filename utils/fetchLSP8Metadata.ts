import { IPFS_GATEWAY_BASE_URL} from '../constants';
import ERC725js, { ERC725JSONSchema } from '@erc725/erc725.js';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import {ethers} from 'ethers'
import { decode } from 'punycode';
import { validateLSP4MetaData } from './validateLSP4Metdata';
import { LSP4Metadata } from '../interfaces/lsps';

// type tokenId = string | number

const LSP8TokenIdType = {
  "name": "LSP8TokenIdType",
  "key": "0x715f248956de7ce65e94d9d836bfead479f7e70d69b718d47bfe7b00e05b4fe4",
  "keyType": "Singleton",
  "valueType": "uint256",
  "valueContent": "Number"
}

const LSP8MetadataJSON = {
  "name": "LSP8MetadataJSON:<uint256>",
  "key": "0x9a26b4060ae7f7d5e3cd0000<uint256>",
  "keyType": "Mapping",
  "valueType": "bytes",
  "valueContent": "JSONURL"
}




const fetchLSP8Metadata = async (tokenId:string ,
  address: string, provider:any):Promise<LSP4Metadata> => {


  const options = {
    ipfsGateway: IPFS_GATEWAY_BASE_URL,
  };


  const erc725Asset = new ERC725js([LSP8TokenIdType, LSP8MetadataJSON] as ERC725JSONSchema[] ,address, provider, options);

  try {
    //fetch tokenIdType
    const tokenIdTypeData = await erc725Asset.fetchData(['LSP8TokenIdType']);

    const tokenIdType = tokenIdTypeData[0].value.toString();

    //fetch LSP8MetadataJSON depending on tokenIdType
    if(tokenIdType === '1') {
      const LSP8Metadata = await erc725Asset.fetchData([{
        keyName: `LSP8MetadataJSON:<address>`,
        dynamicKeyParts: tokenId.toString()
      }]);

      return validateLSP4MetaData(LSP8Metadata[0].value);

    } else if(tokenIdType === '2') {

      const LSP8Metadata = await erc725Asset.fetchData([{
        keyName: `LSP8MetadataJSON:<uint256>`,
        dynamicKeyParts: parseInt(tokenId).toString()
      },]);

      return validateLSP4MetaData(LSP8Metadata[0].value);

    } else if(tokenIdType === '3') {
      const LSP8Metadata = await erc725Asset.fetchData([{
        keyName: `LSP8MetadataJSON:<bytes32>`,
        dynamicKeyParts: tokenId.toString(),
      },]);

      return validateLSP4MetaData(LSP8Metadata[0].value);

    } else {
      return {"LSP4Metadata":{
        description: '',
        links: [],
        images: [[]],
        icons: [],
        assets: [],
      }}
    }
  } catch (error) {
    console.log(error);
    return {"LSP4Metadata":{
      description: '',
      links: [],
      images: [[]],
      icons: [],
      assets: [],
    }}
  }
}

export default fetchLSP8Metadata;
