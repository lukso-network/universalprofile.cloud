import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js'
import Web3 from 'web3'

const getInstance = (address: string, schema: ERC725JSONSchema[]) => {
  const { currentNetwork } = useAppStore()
  const config = {
    ipfsGateway: IPFS_URL,
  }
  const provider = new Web3.providers.HttpProvider(currentNetwork.rpcHttp)
  const erc725 = new ERC725(schema, address, provider, config)

  return erc725
}

const useErc725 = () => {
  return {
    getInstance,
  }
}

export default useErc725
