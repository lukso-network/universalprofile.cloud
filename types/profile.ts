import { LSP3Profile } from '@lukso/lsp-factory.js'

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
