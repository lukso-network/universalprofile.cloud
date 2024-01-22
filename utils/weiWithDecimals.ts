import { fromWei, toWei } from 'web3-utils'

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

const UNIT_BASED_ON_DECIMALS_MAP: Units = {
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

export const fromWeiWithDecimals = (value: string, decimals = 18) => {
  const unit: Unit = UNIT_BASED_ON_DECIMALS_MAP[decimals] || DEFAULT_UNIT

  return fromWei(value, unit)
}

export const toWeiWithDecimals = (value: string, decimals = 18) => {
  const unit: Unit = UNIT_BASED_ON_DECIMALS_MAP[decimals] || DEFAULT_UNIT

  return toWei(value, unit)
}
