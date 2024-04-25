import { ERC725, type ERC725JSONSchema } from '@erc725/erc725.js'

const getInstance = (address: Address, schema: ERC725JSONSchema[]) => {
  const config = {
    ipfsGateway: IPFS_URL,
  }
  const erc725 = new ERC725(schema, address, PROVIDERS.RPC, config)

  return erc725
}

const useErc725 = () => {
  return {
    getInstance,
  }
}

export default useErc725
