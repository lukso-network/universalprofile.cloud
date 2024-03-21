export type NavigatorExtended = Navigator & {
  brave?: { isBrave: () => Promise<boolean> }
}

// HACK, the import for @nuxtjs/device is not working
export type Device = {
  userAgent: string
  isDesktop: boolean
  isIos: boolean
  isAndroid: boolean
  isMobile: boolean
  isMobileOrTablet: boolean
  isDesktopOrTablet: boolean
  isTablet: boolean
  isWindows: boolean
  isMacOS: boolean
  isApple: boolean
  isSafari: boolean
  isFirefox: boolean
  isEdge: boolean
  isChrome: boolean
  isSamsung: boolean
  isCrawler: boolean
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
