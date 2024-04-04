import { toChecksumAddress } from 'web3-utils'
import { isAddress } from 'web3-validator'

export async function resolveProfile(_address: string): Promise<{
  resolved: string
  link: string
  address: Address
  checksummed: Address
}> {
  try {
    const { resolved, link, address, checksummed } = (await fetcher({
      url: `${BASE_PROFILE_LINK_URL}/${_address}/resolve`,
      method: 'GET',
    })) as {
      resolved: string
      link: string
      address: Address
      checksummed: Address
    }
    // @ is a special character we don't want to escape
    return { address, checksummed, resolved, link: link.replace(/%40/g, '@') }
  } catch {
    if (!isAddress(_address)) throw new Error('Invalid address')
    const checksummed = toChecksumAddress(_address) as Address
    return {
      address: _address as Address,
      checksummed: checksummed,
      resolved: _address as string,
      link: `${BASE_PROFILE_LINK_URL}/${checksummed}`,
    }
  }
}

export function useProfileLink(_address: Address) {
  return useAsyncData(() => resolveProfile(_address))
}
