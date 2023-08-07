const detectBrowser = (): BrowserInfo | undefined => {
  const { isChrome, isBrave, isFirefox, isSafari, isEdge, isOpera } =
    useDevice() as DeviceExtended

  if (isBrave) {
    return {
      id: 'brave',
      name: 'Brave',
      icon: 'logo-brave',
    }
  }

  if (isEdge) {
    return {
      id: 'edge',
      name: 'Edge',
      icon: 'logo-edge',
    }
  }

  if (isOpera) {
    return {
      id: 'opera',
      name: 'Opera',
      icon: 'logo-opera',
    }
  }

  if (isChrome) {
    return {
      id: 'chrome',
      name: 'Chrome',
      icon: 'logo-chrome',
    }
  }

  if (isFirefox) {
    return {
      id: 'firefox',
      name: 'Firefox',
      icon: 'logo-firefox',
    }
  }

  if (isSafari) {
    return {
      id: 'safari',
      name: 'Safari',
      icon: 'logo-safari',
    }
  }
}

/**
 * Expose browser info to the app
 */
export const browserInfo = (): BrowserInfo => {
  const browserInfoDefaults = {
    id: 'chrome',
    name: '',
    icon: '',
  } as BrowserInfo
  const browserInfo = { ...browserInfoDefaults, ...detectBrowser() }

  return browserInfo
}
