<script setup lang="ts">
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { isAddress } from 'web3-utils'

import { fetchProfile } from '@/utils/fetchProfile'
import { PROVIDERS, STORAGE_KEY } from '@/types/enums'
import { assertString } from '@/utils/validators'

if (typeof window !== 'undefined') {
  // @ts-ignore
  import('@lukso/web-components')
}

const web3Store = useWeb3Store()
const appStore = useAppStore()
const { addProviderEvents, removeProviderEvents, disconnect } =
  useBrowserExtension()
const {
  setProfile: setConnectedProfile,
  setStatus,
  profile: connectedProfile,
} = useConnectedProfileStore()
const router = useRouter()

const setupTranslations = () => {
  useIntl().setupIntl(defaultConfig)
}

const setupWeb3Instances = () => {
  const provider = INJECTED_PROVIDER

  if (provider) {
    // for chain interactions through wallet
    web3Store.addWeb3(PROVIDERS.INJECTED, provider)
    addProviderEvents(provider)
  } else {
    console.error('No browser extension provider found')
  }

  // for chain interactions through RPC endpoint
  web3Store.addWeb3(
    PROVIDERS.RPC,
    appStore.getNetwork(appStore.selectedNetwork).rpcHttp
  )
}

const setupConnectedProfile = async () => {
  try {
    const connectedAddress = getItem(STORAGE_KEY.CONNECTED_ADDRESS)

    if (connectedAddress) {
      assertAddress(connectedAddress, 'profile')
      setStatus('isConnected', true)
      setStatus('isProfileLoading', true)
      const profile = await fetchProfile(connectedAddress)
      connectedProfile.address = connectedAddress
      setConnectedProfile(profile)
    }
  } catch (error) {
    console.error(error)
  } finally {
    setStatus('isProfileLoading', false)
  }
}

const routerBackProfileLoad = async () => {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const fromProfileAddress = from.params?.profileAddress
      const toProfileAddress = to.params?.profileAddress

      if (!fromProfileAddress || !toProfileAddress) {
        return next()
      }

      try {
        assertString(toProfileAddress)
        assertAddress(toProfileAddress, 'profile')

        if (toProfileAddress !== fromProfileAddress) {
          await setupViewedProfile(toProfileAddress)
          await setupViewedAssets(toProfileAddress)
        }
      } catch (error) {
        console.error(error)
      }
      next()
    }
  )
}

const checkConnectionExpiry = () => {
  const expiryCheck = () => {
    const expiryDate = getItem(STORAGE_KEY.CONNECTION_EXPIRY)

    try {
      assertString(expiryDate)
      const expiryDateParsed = Number(expiryDate)

      if (expiryDateParsed < Date.now()) {
        disconnect()
        // we store address as this is "soft" disconnect that won't trigger request account on connection
        connectedProfile.address &&
          setItem(STORAGE_KEY.RECONNECT_ADDRESS, connectedProfile.address)
      }
    } catch (error) {}
  }

  expiryCheck() // initial check on app load
  setInterval(expiryCheck, CONNECTION_EXPIRY_CHECK_INTERVAL_MS)
}

onMounted(async () => {
  setupTranslations()
  setupWeb3Instances()
  checkConnectionExpiry()
  await setupConnectedProfile()
  await routerBackProfileLoad()

  try {
    const profileAddress = useRouter().currentRoute.value.params?.profileAddress

    if (!isAddress(profileAddress)) {
      navigateTo(notFoundRoute())
    }

    await setupViewedProfile(profileAddress)
    await setupViewedAssets(profileAddress)
  } catch (error) {
    console.error(error)
  }

  setStatus('isProfileLoaded', true)
})

onUnmounted(() => {
  const provider = INJECTED_PROVIDER
  removeProviderEvents(provider)
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppModal />
  </div>
</template>
