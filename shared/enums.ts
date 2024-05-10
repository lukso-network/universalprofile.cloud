export enum PROVIDERS {
  RPC = 'RPC',
  INJECTED = 'INJECTED',
}

export enum STORAGE_KEY {
  CONNECTION_EXPIRY = 'LW:connectionExpiry',
  CURRENCY_STORE = 'LW:currency',
  APP_STORE = 'LW:app',
}

export enum CACHE_KEY {
  CURRENCY_CACHE = 'LW:currency',
}

export enum AssetFilter {
  owned = 'owned',
  created = 'created',
}

export enum STANDARDS {
  EOA = 'EOA',
  LSP3 = 'LSP0ERC725Account',
  LSP7 = 'LSP7DigitalAsset',
  LSP8 = 'LSP8IdentifiableDigitalAsset',
  UNKNOWN = 'UnknownDataType',
}

export const STANDARDS_ABBREVIATIONS = {
  EOA: 'EOA',
  LSP7DigitalAsset: 'LSP7',
  LSP8IdentifiableDigitalAsset: 'LSP8',
  LSP0ERC725Account: 'LSP3',
  UnknownDataType: 'UNKNOWN',
}
