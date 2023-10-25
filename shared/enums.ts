export enum PROVIDERS {
  RPC = 'RPC',
  INJECTED = 'INJECTED',
}

export enum STORAGE_KEY {
  CONNECTION_EXPIRY = 'LW:connectionExpiry',
  RECONNECT_ADDRESS = 'LW:reconnectAddress',
  CURRENCY_STORE = 'LW:currency',
  APP_STORE = 'LW:app',
  ASSET_STORE = 'LW:assets',
  PROFILE_STORE = 'LW:profiles',
  IMAGE_STORE = 'LW:images',
}

export enum CACHE_KEY {
  CURRENCY_CACHE = 'LUKSO_WALLET:currencyCache',
}

// We use ?referrer=XXX in the URL queries to enable/disable specific features
export enum REFERRERS {
  INDEXER = 'indexer',
}
