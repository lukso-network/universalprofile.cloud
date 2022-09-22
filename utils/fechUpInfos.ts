import ERC725, { ERC725JSONSchema } from '@erc725/erc725.js';
import erc725Schema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';

import { IPFS_GATEWAY_BASE_URL } from '../constants';

const fetchUPInfos = async (walletAddress: string, web3Provider: any) => {
  const config = { ipfsGateway: IPFS_GATEWAY_BASE_URL };

  const erc725 = new ERC725(
    erc725Schema as ERC725JSONSchema[],
    walletAddress,
    web3Provider,
    config,
  );
  try {
    const LSP3Profile = await erc725.fetchData(['LSP3Profile']);
    return LSP3Profile;
  } catch (error) {
    console.log(error);
  }
};

export default fetchUPInfos;
