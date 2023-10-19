import { CurrencyList, CurrencySymbol } from '@/types/currency'

/**
 * Settings store
 * Keeps the information about app settings
 * Data is stored in local storage
 *
 */
export const useCurrencyStore = defineStore(
  'currency',
  () => {
    const currencyList = ref<CurrencyList>()
    const currentCurrencySymbol = ref<CurrencySymbol>(DEFAULT_CURRENCY_SYMBOL)

    const getCurrencyMultiplier = () => {
      return (symbol: string) =>
        currencyList.value &&
        currencyList.value[symbol] &&
        currencyList.value[symbol][currentCurrencySymbol.value]
    }

    return {
      currentCurrencySymbol,
      currencyList,
      getCurrencyMultiplier,
    }
  },
  {
    persist: {
      storage: persistedState.localStorage,
      key: STORAGE_KEY.CURRENCY_STORE,
    },
  }
)
