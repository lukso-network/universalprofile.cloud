import type {
  LSP3ProfileMetadata,
  LinkMetadata,
} from '@lukso/lsp-smart-contracts'

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
  isLoaded?: boolean
  profileLink?: ProfileLink
}

export type ProfileFollowers = {
  isFollowing?: boolean
  followingCount?: number
  followingAddresses?: Address[]
  followerCount?: number
  followerAddresses?: Address[]
  isLoading?: boolean
}

export type ProfileLink = {
  resolved: string
  link: string
  address: Address
  checksummed: Address
  isResolved: boolean
}

export type Creator = Pick<
  Profile,
  'name' | 'address' | 'profileImage' | 'issuedAssets'
>

export type IndexedProfile = {
  address: Address
  LSP3Profile?: LSP3ProfileMetadata
  profileImageUrl?: string
  LSPStandard: Standard
  type: Standard
  hasProfileImage?: boolean
  hasBackgroundImage?: boolean
}
