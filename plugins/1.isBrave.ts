import { DeviceExtended, NavigatorExtended } from '@/types/device'
import { NuxtApp } from 'nuxt/app'

/**
 * Detects if the browser is Brave
 *
 * @param nuxtApp - nuxt app instance
 */
export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
  const navigatorBrave = navigator as NavigatorExtended

  nuxtApp?.$device &&
    ((nuxtApp.$device as DeviceExtended).isBrave =
      (navigatorBrave.brave && (await navigatorBrave.brave.isBrave())) || false)
})
