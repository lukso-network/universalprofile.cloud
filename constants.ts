export const L16_RPC_URL = 'https://rpc.l16.lukso.network';

export const L16_CHAIN_ID = 2828;

export const COMMON_ABIS = {
  supportsInterface: [
    {
      inputs: [
        {
          internalType: 'bytes4',
          name: 'interfaceId',
          type: 'bytes4',
        },
      ],
      name: 'supportsInterface',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
};

export const IPFS_GATEWAY_BASE_URL = 'https://ipfs.io/ipfs/'; //'https://2eff.lukso.dev/ipfs/' not working;

export const luksoImg =
  'https://uploads-ssl.webflow.com/629f44560745074760731ba4/62ad910dcff6e02d12a15c35_03_ICON_TOOLS_SMALL.png';
