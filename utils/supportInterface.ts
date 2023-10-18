import { LSP0ERC725Account } from '@/types/contracts'
import { PROVIDERS } from '@/types/enums'

/**
 * Checks if a smart contract supports a given interface.
 * https://eips.ethereum.org/EIPS/eip-165
 *
 * @param string address - an address for the smart contract
 * @param string interfaceId - an interfaceId to check
 * @returns true/false whether the transaction supports the interface or not
 */
export const supportInterface = async (
  address: Address,
  interfaceId: string
): Promise<boolean> => {
  const { contract } = useWeb3(PROVIDERS.RPC)

  try {
    const eip165Contract = contract<LSP0ERC725Account>(
      eip165ABI as any,
      address
    )
    return await eip165Contract.methods.supportsInterface(interfaceId).call()
  } catch (error: unknown) {
    console.error(error)
    return false
  }
}
