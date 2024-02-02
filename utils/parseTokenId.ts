import { LSP8_TOKEN_ID_FORMAT } from '@lukso/lsp-smart-contracts'
import { hexToNumber, hexToUtf8 } from 'web3-utils'

/**
 * Parse token ID based on the format
 *
 * @param tokenId
 * @param tokenIdFormat
 * @returns
 */
export const parseTokenId = (tokenId?: string, tokenIdFormat?: number) => {
  if (!tokenId) {
    return ''
  }

  switch (tokenIdFormat) {
    case LSP8_TOKEN_ID_FORMAT.STRING:
      // decode hex value to string
      return encodeURI(hexToUtf8(tokenId))
    case LSP8_TOKEN_ID_FORMAT.NUMBER:
      // convert hex value to number
      return hexToNumber(tokenId).toString()
    case LSP8_TOKEN_ID_FORMAT.ADDRESS:
      // address needs to be lowercase
      return tokenId.toLowerCase()
    case LSP8_TOKEN_ID_FORMAT.UNIQUE_ID:
    case LSP8_TOKEN_ID_FORMAT.HASH:
      // remove 0x from uid/hash token ids
      // also hex value need to be lowercase
      return tokenId.slice(2).toLowerCase()
    default:
      return tokenId
  }
}

/**
 * Add `#` prefix to token id
 *
 * @param tokenIdFormat
 * @returns
 */
export const tokenIdPrefix = (tokenIdFormat?: number) => {
  // no prefix for address
  if (tokenIdFormat === 2) {
    return ''
  }

  return '#'
}
