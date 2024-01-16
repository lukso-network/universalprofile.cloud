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
  IMAGE_STORE = 'LW:images',
  CREATOR_STORE = 'LW:creators',
}

export enum CACHE_KEY {
  CURRENCY_CACHE = 'LW:currency',
}

// We use ?referrer=XXX in the URL queries to enable/disable specific features
export enum REFERRERS {
  INDEXER = 'indexer',
}
