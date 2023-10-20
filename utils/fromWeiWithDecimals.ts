import { fromWei } from 'web3-utils'

type Unit =
  | 'noether'
  | 'wei'
  | 'ether'
  | 'kwei'
  | 'gwei'
  | 'mwei'
  | 'microether'
  | 'milliether'
  | 'kether'
  | 'mether'
  | 'gether'
  | 'tether'

type Units = {
  [key: number]: Unit
}

const DEFAULT_UNIT: Unit = 'ether'

export const fromWeiWithDecimals = (amount: string, decimals = 18) => {
  const units: Units = {
    0: 'wei',
    3: 'kwei',
    6: 'mwei',
    9: 'gwei',
    12: 'microether',
    15: 'milliether',
    18: 'ether',
    21: 'kether',
    24: 'mether',
    27: 'gether',
    30: 'tether',
  }

  const unit: Unit = units[decimals] || DEFAULT_UNIT

  return fromWei(amount, unit)
}
