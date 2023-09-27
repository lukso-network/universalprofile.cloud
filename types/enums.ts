export enum PROVIDERS {
  RPC = 'RPC',
  INJECTED = 'INJECTED',
}

export enum STORAGE_KEY {
  CONNECTED_ADDRESS = 'LUKSO_WALLET:connectedAddress',
  CONNECTION_EXPIRY = 'LUKSO_WALLET:connectionExpiry',
  RECONNECT_ADDRESS = 'LUKSO_WALLET:reconnectAddress',
}
// We use ?referrer=XXX in the URL queries to enable/disable specific features
export enum REFERRERS {
  INDEXER = 'indexer',
}
