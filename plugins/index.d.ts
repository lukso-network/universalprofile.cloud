import { FormatNumberOptions } from '@formatjs/intl'

declare module '#app' {
  interface NuxtApp {
    $formatMessage(key: string, options?: Record<string, string>): string
    $formatNumber(value: string | number, options?: FormatNumberOptions): string
    $formatDate(date?: string | number | Date): string
    $formatTime(date?: string | number | Date): string
    $formatCurrency(value: string, symbol: string): string
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatMessage(key: string, options?: Record<string, string>): string
    $formatNumber(value: string | number, options?: FormatNumberOptions): string
    $formatDate(date?: string | number | Date): string
    $formatTime(date?: string | number | Date): string
    $formatCurrency(value: string, symbol: string): string
  }
}

export {}
