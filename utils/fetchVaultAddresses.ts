import ERC725js, { ERC725JSONSchema } from '@erc725/erc725.js';
import { IPFS_GATEWAY_BASE_URL } from '../constants';
import schemas from '@erc725/erc725.js/schemas/LSP10ReceivedVaults.json';

const options = {
  ipfsGateway: IPFS_GATEWAY_BASE_URL,
};

const fetchVaultsAddresses = async (
  ownerAddress: string,
  provider: any,
): Promise<string[] | []> => {
  const erc725Asset = new ERC725js(
    schemas as ERC725JSONSchema[],
    ownerAddress,
    provider,
    options,
  );
  try {
    const vaultsIndex = await erc725Asset.fetchData('LSP10Vaults[]');
    return vaultsIndex.value as string[];
  } catch (er) {
    console.log(er);
    return [];
  }
};

export default fetchVaultsAddresses;
