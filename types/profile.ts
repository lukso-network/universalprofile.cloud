import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

export type Profile = {
  address?: Address
  name?: string
  balance?: string
  links?: LinkMetadata[]
  tags?: string[]
  description?: string
  standard?: Standard
  profileImageId?: string
  backgroundImageId?: string
  issuedAssets?: Address[]
  receivedAssets?: Address[]
  profileImage?: Image[]
  backgroundImage?: Image[]
  isLoading?: boolean
  profileLink?: ProfileLink
}

export type ProfileLink = {
  resolved: string
  link: string
  address: Address
  checksummed: Address
  isResolved: boolean
}
