import type { TransactionConfig } from 'web3-core'
import type { ContractOptions } from 'web3-eth-contract'
import type { AbiItem } from 'web3-utils'

export default function useWeb3(providerName: string) {
  const web3Store = useWeb3Store()

  const getWeb3 = () => {
    const web3 = web3Store.getWeb3(providerName)

    if (!web3) {
      throw new Error(`Web3 instance not found for provider: ${providerName}`)
    }

    return web3
  }

  return {
    getWeb3,
    contract: <T>(
      jsonInterface: AbiItem[],
      address?: string,
      options?: ContractOptions
    ) => {
      const web3 = getWeb3()

      try {
        return new web3.eth.Contract(jsonInterface, address, options) as T
      } catch (error) {
        console.error(error)
      }
    },
    requestAccounts: async (): Promise<Address[]> => {
      const addresses = await getWeb3().eth.requestAccounts()
      try {
        assertAddresses(addresses, 'profile')
        return addresses
      } catch {
        return []
      }
    },
    accounts: async () => {
      const [account] = await getWeb3().eth.getAccounts()
      try {
        assertAddress(account, 'profile')
        return account
      } catch {
        return
      }
    },
    isEoA: async (address: string) => {
      const result = await getWeb3().eth.getCode(address)

      return result === '0x'
    },
    getBalance: async (address: Address) => {
      return await getWeb3().eth.getBalance(address)
    },
    sendTransaction: async (transaction: TransactionConfig) => {
      return await getWeb3()
        .eth.sendTransaction(transaction)
        .on('receipt', (receipt: any) => {
          console.log(receipt)
        })
        .once('sending', payload => {
          console.log(JSON.stringify(payload, null, 2))
        })
    },
    getChainId: async () => {
      return await getWeb3().eth.getChainId()
    },
  }
}
