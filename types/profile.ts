import { LSP3Profile } from '@lukso/lsp-factory.js'

export interface Profile extends LSP3Profile {
  backgroundImageUrl?: Base64EncodedImage
  profileImageUrl?: Base64EncodedImage
  address?: Address
  balance: string
}

export type Receiver = Partial<Profile> & { isEoa?: boolean }

export type Creator = Partial<
  Pick<Profile, 'address' | 'profileImageUrl' | 'name'>
>

export interface IndexedProfile {
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
