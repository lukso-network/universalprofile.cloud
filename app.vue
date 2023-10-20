<script setup lang="ts">
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { isAddress } from 'web3-utils'

import { fetchProfile } from '@/utils/fetchProfile'
import { assertString } from '@/utils/validators'

if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

const web3Store = useWeb3Store()
const { getNetwork, selectedNetwork, modal } = useAppStore()
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
  web3Store.addWeb3(PROVIDERS.RPC, getNetwork(selectedNetwork).rpcHttp)
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
          await loadViewedProfile(toProfileAddress)
          await loadViewedAssets(toProfileAddress)
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

const setupCurrencies = async () => {
  const { currencyList } = storeToRefs(useCurrencyStore())
  const { fetchCurrencies } = useCurrency()

  currencyList.value = await fetchCurrencies()
}

const setupViewedProfile = async () => {
  try {
    const profileAddress = useRouter().currentRoute.value.params?.profileAddress

    if (profileAddress) {
      if (isAddress(profileAddress)) {
        await loadViewedProfile(profileAddress)
        await loadViewedAssets(profileAddress)
      } else {
        navigateTo(notFoundRoute())
      }
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  setupTranslations()
  setupWeb3Instances()
  checkConnectionExpiry()
  await setupConnectedProfile()
  await setupViewedProfile()
  await routerBackProfileLoad()

  setStatus('isProfileLoaded', true)

  await setupCurrencies()
})

onUnmounted(() => {
  const provider = INJECTED_PROVIDER
  removeProviderEvents(provider)
})

useHead({
  bodyAttrs: {
    class: computed(() => {
      if (modal?.isOpen) {
        return 'overflow-hidden'
      }

      return ''
    }),
  },
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
