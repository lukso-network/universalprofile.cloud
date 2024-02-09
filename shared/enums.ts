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

// We use ?referrer=XXX in the URL queries to enable/disable specific features
export enum REFERRERS {
  INDEXER = 'indexer',
}

export enum AssetFilter {
  owned = 'owned',
  created = 'created',
}

export enum PROFILE_TYPES {
  EOA = 'EOA',
  LSP3 = 'LSP3Profile',
}

export enum ASSET_TYPES {
  EOA = 'EOA',
  LSP7 = 'LSP7DigitalAsset',
  LSP8 = 'LSP8IdentifiableDigitalAsset',
}

export const STANDARDS_ABBREVIATIONS = {
  EOA: 'EOA',
  LSP7DigitalAsset: 'LSP7',
  LSP8IdentifiableDigitalAsset: 'LSP8',
}
