import { LSP3Profile } from '@lukso/lsp-factory.js'

export type Profile = {
  address?: Address
  name?: string
  backgroundImage?: Base64EncodedImage
  profileImage?: Base64EncodedImage
  balance: string
  issuedAssets?: Address[] // LSP12
  receivedAssets?: Address[] // LSP5
  metadata?: LSP3Profile // LSP3
}

export type Receiver = Pick<
  Profile,
  'address' | 'backgroundImage' | 'profileImage'
> & { isEoa?: boolean }

export type Creator = Pick<Profile, 'address' | 'profileImage' | 'name'>

export type IndexedProfile = {
  address: Address
  profileURL?: string
  profileHash?: string
  profileHashFunction?: string
  LSP3Profile?: LSP3Profile
  hasProfileName?: boolean
  hasProfileDescription?: boolean
  backgroundImageUrl?: string
  hasBackgroundImage?: boolean
  profileImageUrl?: string
  hasProfileImage?: boolean
  updatedAtBlock: number
  network: string
  objectID: string
}
