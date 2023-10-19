import { CurrencyCache, CurrencyList } from '@/types/currency'

const fetchCurrencies = async () => {
  const cache = await caches.open(CACHE_KEY.CURRENCY_CACHE)
  const compareTokens = [CRYPTO_COMPARE_LYX_TOKEN_NAME] // we can add more tokens here if needed
  const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${compareTokens.join(
    ','
  )}&tsyms=${CURRENCY_TO_FETCH_FROM_API.join(`,`)}`
  const cacheData = await cache.match(url)

  if (cacheData) {
    const cacheDataJson: CurrencyCache = await cacheData.json()

    if (cacheDataJson.expires > Date.now()) {
      return cacheDataJson.currencies
    } else {
      caches.delete(url)
    }
  }

  const currencies = await fetcher<CurrencyList, Record<string, never>>({
    url,
    method: 'GET',
  })
  const cacheObject = {
    currencies,
    expires: Date.now() + 1000 * 60 * CURRENCY_CACHE_EXPIRY_IN_MINUTES,
  }
  await cache.put(url, new Response(JSON.stringify(cacheObject)))

  return currencies
}

export const useCurrency = () => {
  return {
    fetchCurrencies,
  }
}
