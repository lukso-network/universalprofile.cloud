export type CurrencySymbol = 'USD' | 'EUR' | 'GBP' | 'PLN'

export type CurrencyList = {
  [key: string]: {
    [key in CurrencySymbol]: number
  }
}

export type CurrencyCache = { currencies: CurrencyList; expires: number }
