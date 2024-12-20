<script setup lang="ts">
import { SUPPORTED_NETWORK_IDS } from '@/shared/config'
import { INJECTED_PROVIDER } from '@/shared/provider'
import { assertString } from '@/utils/validators'

if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

const { addWeb3, getWeb3 } = useWeb3Store()
const { getNetworkById } = useAppStore()
const {
  isLoadedApp,
  selectedChainId,
  isSearchOpen,
  isModalOpen,
  isWalletConnect,
  isMobile,
} = storeToRefs(useAppStore())
const { addProviderEvents, removeProviderEvents } =
  useBrowserExtensionProvider()
const { disconnect } = useBaseProvider()
const { cacheValue } = useCache()
const { currencyList } = storeToRefs(useCurrencyStore())
const {
  initProvider: initWalletConnectProvider,
  connect: connectWalletConnect,
} = useWalletConnectProvider()
const { formatMessage } = useIntl()
const { gridChainId, tempGrids } = storeToRefs(useGridStore())
const swHasUpgrade = ref<boolean>(false)

// Make the service worker update available to the rest of the app
// any view can use inject('swHasUpgrade') to access this value
provide('swHasUpgrade', swHasUpgrade)

/**
 * Setup redirect from old domain to new domain
 */
const setupDomainRedirect = () => {
  const currentDomain = window.location.hostname
  const newDomain = 'universaleverything.io'
  const oldDomain = 'universalprofile.cloud'

  if (currentDomain === oldDomain) {
    window.location.href = `https://${newDomain}${window.location.pathname}${window.location.search}`
  }
}

/**
 * Setup translations
 */
const setupTranslations = () => {
  useIntl().setupIntl(defaultConfig)
}

/**
 * Create web3 instances
 * INJECTED - from browser extension
 * RPC - from RPC endpoint
 */
const setupWeb3Instances = async () => {
  // set web3 for injected provider
  if (INJECTED_PROVIDER) {
    // for chain interactions through dapp
    addWeb3(PROVIDERS.INJECTED, INJECTED_PROVIDER)
    await addProviderEvents(INJECTED_PROVIDER)
  } else {
    console.error('No browser extension provider found')
  }

  const rpcNode = await selectRpcNode()

  if (rpcNode) {
    // for chain interactions through RPC endpoint
    addWeb3(PROVIDERS.RPC, rpcNode?.host, { headers: rpcNode.headers })
    // expose web3 instance to global scope for console access
    window.web3 = getWeb3(PROVIDERS.RPC)
  }

  // reconnect wallet connect
  if (isWalletConnect.value) {
    await initWalletConnectProvider()
    await connectWalletConnect()
  }
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
  const getCurrencies = async () => {
    const currencies = await fetcher<CurrencyList, Record<string, never>>({
      url: `${CURRENCY_API_URL}/data/pricemulti?fsyms=${CURRENCY_API_LYX_TOKEN_NAME}&tsyms=${CURRENCY_API_SYMBOLS.join(',')}`,
      method: 'GET',
    })
    return currencies
  }

  currencyList.value = await cacheValue<CurrencyList>(getCurrencies, {
    key: 'currencies',
    expiryAfter: CURRENCY_CACHE_EXPIRY,
  })
}

/**
 * Setup network based on `network` query param.
 * Check if dApp network match with extension and if not show network switch modal.
 */
const setupNetwork = async () => {
  const network = useRouter().currentRoute.value.query?.network

  if (!network) {
    return
  }

  if (SUPPORTED_NETWORK_IDS.includes(network)) {
    selectedChainId.value = getNetworkById(network).chainId

    // reset temp grid layout if network is changed
    if (gridChainId.value !== selectedChainId.value) {
      tempGrids.value = {}
    }
  } else {
    console.warn(
      `Invalid network: ${network}, valid networks are ${SUPPORTED_NETWORK_IDS.join(', ')}`
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

/**
 * Check if user bought LYX
 */
const checkBuyLyx = () => {
  const buyLyx = useRouter().currentRoute.value.query?.buyLyx as
    | string
    | undefined

  if (buyLyx) {
    genericLog('Buy lyx order', buyLyx)

    const { showModal } = useModal()

    showModal({
      data: {
        icon: '/images/lukso.svg',
        title: formatMessage('transak_success_title'),
        message: formatMessage('transak_success_message'),
        confirmButtonText: formatMessage('transak_success_button'),
      },
    })
  }
}

const resetDataProvider = () => {
  const { fetchDataProviderReset, fetchDataProvider } =
    storeToRefs(useAppStore())

  // reset will happen only once and it will change data provider to graph
  if (fetchDataProviderReset.value === false) {
    fetchDataProvider.value = 'graph'
    fetchDataProviderReset.value = true
  }
}

onMounted(async () => {
  try {
    setupDomainRedirect()
    setupTranslations()
    setupNetwork()
    await setupWeb3Instances()
    checkConnectionExpiry()
    await setupConnectedProfile()
    resetDataProvider()
    isLoadedApp.value = true
    await setupCurrencies()
    window.scrollTo(0, 0)
    checkBuyLyx()
  } catch (error) {
    console.error(error)
  }
})

onUnmounted(() => {
  const provider = INJECTED_PROVIDER
  removeProviderEvents(provider)
})

useHead({
  bodyAttrs: {
    // @ts-ignore
    class: computed(() => {
      const bodyClass = []

      // prevent window scroll when search modal is open
      if (isSearchOpen.value || (!isMobile.value && isModalOpen.value)) {
        bodyClass.push('!overflow-hidden')
      }

      return bodyClass.join(' ')
    }),
  },
})
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(registration => {
    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            swHasUpgrade.value = true
          }
        })
      }
    })
  })
}
</script>

<template>
  <NuxtPwaManifest />
  <div>
    <NuxtLayout>
      <NuxtPage v-if="isLoadedApp" />
      <div v-else>
        <AppLoader class="absolute left-[calc(50vw-20px)] top-[300px]" />
      </div>
    </NuxtLayout>
    <AppModal v-if="isLoadedApp" />
    <!-- <VueQueryDevtools /> -->
  </div>
</template>
