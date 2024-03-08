// import { BaseModel } from '@/models/base'

// import type {
//   LSP3ProfileMetadata,
//   // LinkMetadata,
// } from '@lukso/lsp-smart-contracts'
// import type { Image } from '@/types/image'

// export class ProfileModel extends BaseModel {
//   static entity = 'profiles'
//   static primaryKey = 'address'

//   static fields() {
//     return {
//       ...super.fields(),
//       isLoading: this.attr(true),
//       address: this.attr(null),
//       name: this.string(''),
//       balance: this.string(''),
//       links: this.attr([]),
//       tags: this.attr([]),
//       description: this.string(''),
//       standard: this.attr(null),
//       profileImage: this.attr(null),
//       backgroundImage: this.attr(null),
//       issuedAssetAddresses: this.attr(null),
//       receivedAssetAddresses: this.attr(null),
//     }
//   }

//   // types
//   declare isLoading: boolean
//   declare address?: Address
//   declare name?: string
//   declare balance?: string
//   declare links?: LinkMetadata[]
//   declare tags?: string[]
//   declare description?: string
//   declare standard?: Standard
//   declare profileImageId?: string
//   declare backgroundImageId?: string
//   declare issuedAssetAddresses?: Address[]
//   declare receivedAssetAddresses?: Address[]
//   declare profileImage?: Image[]
//   declare backgroundImage?: Image[]
// }

// export type Profile = Partial<ProfileModel>

// Type of data returned from Algolia, it's not fully covered as some
// properties are irrelevant
