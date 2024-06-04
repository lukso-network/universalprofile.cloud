type FetchDataProvider = 'rpc' | 'graph'

export const fetchFromRpc = () => {
  const { getItem } = useLocalStorage()

  // first check in local storage
  const fetchDataProviderLocalStorage = getItem('fetch-data-provider') as
    | FetchDataProvider
    | null
    | undefined

  if (fetchDataProviderLocalStorage) {
    return fetchDataProviderLocalStorage === 'rpc'
  }

  // fallback to environment
  const {
    public: { FETCH_DATA_PROVIDER: fetchDataProviderEnvironment = 'graph' },
  } = useRuntimeConfig()

  return fetchDataProviderEnvironment === 'rpc'
}
