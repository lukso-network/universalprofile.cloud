import {
  createIntl,
  FormatNumberOptions,
  IntlConfig,
  IntlShape,
} from '@formatjs/intl'

import defaultMessages from '@/translations/en_US.json'

const intl = ref<IntlShape>()
const messages = defaultMessages as unknown as Record<string, string>

// For more options check https://github.com/formatjs/formatjs/blob/main/packages/ecma402-abstract/types/number.ts#L38-L45
const formatNumberDefaultOptions = {
  maximumFractionDigits: 6,
}

export const defaultConfig: IntlConfig = {
  locale: 'en-US',
  messages,
}

/**
 * Initialize intl instance
 *
 * @param config - intl config
 */
const setupIntl = (config: IntlConfig) => {
  intl.value = createIntl({ ...config, defaultLocale: 'en-US' })
}

/**
 * Translate a string based on the key
 *
 * @param key - translation key
 * @param options - options for formatMessage
 * @returns - translated string
 */
const formatMessage = (key: string, options?: Record<string, string>) => {
  if (options) {
    return intl.value?.formatMessage({ id: key }, options) || ''
  } else {
    return intl.value?.formatMessage({ id: key }) || ''
  }
}

/**
 * Number formatting based on the locale
 *
 * @param value - number to format
 * @param options - options for formatNumber, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters
 * @returns - formatted number
 */
const formatNumber = (value: number, options: FormatNumberOptions = {}) => {
  if (value === null || value === undefined) {
    return '0'
  }

  const mergedOptions = {
    ...formatNumberDefaultOptions,
    ...options,
  }

  return intl.value?.formatNumber(value, mergedOptions) || ''
}

/**
 * Date formatting based on the locale
 *
 * @param date - date to format
 * @returns - formatted date
 */
const formatDate = (date?: string | number | Date) => {
  return intl.value?.formatDate(date)
}

const formatTime = (date?: string | number | Date) => {
  return intl.value?.formatTime(date)
}

export const useIntl = () => {
  return {
    setupIntl,
    formatMessage,
    formatNumber,
    formatDate,
    formatTime,
  }
}
