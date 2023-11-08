import { Device } from 'node_modules/@nuxtjs/device/dist/runtime/types'

export type NavigatorExtended = Navigator & {
  brave?: { isBrave: () => Promise<boolean> }
}

export type BrowserName =
  | 'chrome'
  | 'safari'
  | 'firefox'
  | 'edge'
  | 'opera'
  | 'brave'

export type DeviceExtended = Device & { isBrave: boolean; isOpera: boolean }

export type BrowserInfo = {
  id: BrowserName
  name: string
  icon: string
  storeLink: string
}
