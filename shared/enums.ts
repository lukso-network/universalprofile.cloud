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
