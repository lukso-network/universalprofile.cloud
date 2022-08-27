import ERC725js, { ERC725JSONSchema } from '@erc725/erc725.js';
import { IPFS_GATEWAY_BASE_URL } from '../constants';

const schemas = [
  {
    name: 'LSP10Vaults[]',
    key: '0x55482936e01da86729a45d2b87a6b1d3bc582bea0ec00e38bdb340e3af6f9f06',
    keyType: 'Array',
    valueType: 'address',
    valueContent: 'Address',
  },
];

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
  const vaultsIndex = await erc725Asset.fetchData('LSP10Vaults[]');
  return vaultsIndex.value as string[];
};

export default fetchVaultsAddresses;
