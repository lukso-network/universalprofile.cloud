<script setup lang="ts">
// import { isAddress } from 'web3-utils'
// import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

import { assertString } from '@/utils/validators'
import { SUPPORTED_NETWORK_IDS } from '@/shared/config'

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

const { addWeb3, getWeb3 } = useWeb3Store()
const { getNetworkByChainId, getNetworkById } = useAppStore()
const { isLoadedApp, isLoadingProfile, selectedChainId, modal, isSearchOpen } =
  storeToRefs(useAppStore())
const { addProviderEvents, removeProviderEvents, disconnect } =
  useBrowserExtension()
const router = useRouter()
const profileRepo = useRepo(ProfileRepository)

const setupTranslations = () => {
  useIntl().setupIntl(defaultConfig)
}

/**
 * Create web3 instances
 * INJECTED - from browser extension
 * RPC - from RPC endpoint
 */
const setupWeb3Instances = async () => {
  const provider = INJECTED_PROVIDER

  if (provider) {
    // for chain interactions through wallet
    addWeb3(PROVIDERS.INJECTED, provider)
    await addProviderEvents(provider)
    // expose web3 instance to global scope for console access
    window.web3 = getWeb3(PROVIDERS.INJECTED)
  } else {
    console.error('No browser extension provider found')
  }

  // for chain interactions through RPC endpoint
  addWeb3(PROVIDERS.RPC, getNetworkByChainId(selectedChainId.value).rpcHttp)
}

/**
 * Load profile data when using back button
 * Useful especially after page refresh where store data is cleared
 */
const routerBackProfileLoad = async () => {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      // we load profile only if going to the profile dashboard
      if (to.name !== 'profileAddress') {
        next()
        return
      }

      const toProfileAddress = to.params?.profileAddress
      assertAddress(toProfileAddress, 'profile')

      const storeProfile = profileRepo.getProfile(toProfileAddress)

      // only makes sense to load profile if it's not already loaded
      if (!storeProfile) {
        try {
          isLoadingProfile.value = true
          // await fetchAndStoreProfile(toProfileAddress)
          // fetchAndStoreAssets(toProfileAddress)
          isLoadingProfile.value = false
        } catch (error) {
          console.error(error)
        }
      }
      next()
    }
  )
}

/**
 * Check if connection to the extension has expired
 * Every connection has expiration time that is stored in local storage
 */
const checkConnectionExpiry = () => {
  const expiryCheck = () => {
    const expiryDate = getItem(STORAGE_KEY.CONNECTION_EXPIRY)

    try {
      assertString(expiryDate)
      const expiryDateParsed = Number(expiryDate)

      if (expiryDateParsed < Date.now()) {
        disconnect()
      }
    } catch (error) {}
  }

  expiryCheck() // initial check on app load
  setInterval(expiryCheck, CONNECTION_EXPIRY_CHECK_INTERVAL_MS)
}

/**
 * Setup currencies that are fetched from cryptocompare API
 */
const setupCurrencies = async () => {
  const { currencyList } = storeToRefs(useCurrencyStore())
  const { fetchCurrencies } = useCurrency()

  currencyList.value = await fetchCurrencies()
}

/**
 * Setup network based on `network` query param.
 * Check if dApp network match with extension and if not show network switch modal.
 */
const setupNetwork = async () => {
  const network = useRouter().currentRoute.value.query?.network

  if (!network) {
    await checkExtensionNetwork()
    return
  }

  if (SUPPORTED_NETWORK_IDS.includes(network)) {
    selectedChainId.value = getNetworkById(network).chainId
    await checkExtensionNetwork()
  } else {
    console.warn(
      `Invalid network: ${network}, valid networks are ${SUPPORTED_NETWORK_IDS.join(
        ', '
      )}`
    )
  }
}

/**
 * Load connected profile data, this is mainly when refreshing asset details
 * where we don't have reference to viewed profile
 */
const setupConnectedProfile = async () => {
  const viewedProfileAddress =
    useRouter().currentRoute.value.params?.profileAddress
  const { connectedProfileAddress } = storeToRefs(useAppStore())

  // no need to load same profile again
  if (viewedProfileAddress === connectedProfileAddress.value) {
    return
  }

  try {
    assertAddress(connectedProfileAddress.value)
    // await setupProfile(connectedProfileAddress.value)
  } catch (error) {
    // if we can't find connected profile in the index we should disconnect it
    // it also happens when user redirect to different network through query param while being connected
    if (error instanceof NotFoundIndexError) {
      disconnect()
    }
  }
}

onMounted(async () => {
  setupTranslations()
  setupNetwork()
  await setupWeb3Instances()
  checkConnectionExpiry()
  await routerBackProfileLoad()
  await setupConnectedProfile()

  isLoadedApp.value = true

  await setupCurrencies()
})

onUnmounted(() => {
  const provider = INJECTED_PROVIDER
  removeProviderEvents(provider)
})

useHead({
  bodyAttrs: {
    // @ts-ignore
    class: computed(() => {
      // prevent window scroll when modal is open
      if (modal.value?.isOpen || isSearchOpen.value) {
        return '!overflow-hidden'
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
    <!-- <VueQueryDevtools /> -->
  </div>
</template>
