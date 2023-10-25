export enum PROVIDERS {
  RPC = 'RPC',
  INJECTED = 'INJECTED',
}

export enum STORAGE_KEY {
  CONNECTED_ADDRESS = 'LUKSO_WALLET:connectedAddress',
  CONNECTION_EXPIRY = 'LUKSO_WALLET:connectionExpiry',
  RECONNECT_ADDRESS = 'LUKSO_WALLET:reconnectAddress',
  CURRENCY_STORE = 'LUKSO_WALLET:currencyStore',
  ASSET_STORE = 'LUKSO_WALLET:assetStore',
  PROFILE_STORE = 'LUKSO_WALLET:profileStore',
  IMAGE_STORE = 'LUKSO_WALLET:imageStore',
}

export enum CACHE_KEY {
  CURRENCY_CACHE = 'LUKSO_WALLET:currencyCache',
}

// We use ?referrer=XXX in the URL queries to enable/disable specific features
export enum REFERRERS {
  INDEXER = 'indexer',
}
