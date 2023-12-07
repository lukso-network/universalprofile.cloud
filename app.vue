<script setup lang="ts">
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { isAddress } from 'web3-utils'

import { assertString } from '@/utils/validators'
import { SUPPORTED_NETWORK_IDS } from '@/shared/config'

if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

const { addWeb3, getWeb3 } = useWeb3Store()
const { getNetworkByChainId, getNetworkById } = useAppStore()
const { isLoadedApp, selectedChainId, modal } = storeToRefs(useAppStore())
const { addProviderEvents, removeProviderEvents, disconnect } =
  useBrowserExtension()
const router = useRouter()

const setupTranslations = () => {
  useIntl().setupIntl(defaultConfig)
}

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

const routerBackProfileLoad = async () => {
  router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const fromProfileAddress = from.params?.profileAddress
      const toProfileAddress = to.params?.profileAddress

      if (toProfileAddress) {
        try {
          assertString(toProfileAddress)
          assertAddress(toProfileAddress, 'profile')
          if (toProfileAddress !== fromProfileAddress) {
            await fetchProfile(toProfileAddress)
            await fetchAssets(toProfileAddress)
          }
        } catch (error) {
          console.error(error)
        }
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
        await fetchProfile(profileAddress)
        await fetchAssets(profileAddress)
      } else {
        navigateTo(notFoundRoute())
      }
    }
  } catch (error: unknown) {
    console.error(error)

    if (error instanceof EoAError) {
      navigateTo(notFoundRoute()) // TODO we might want to inform user about EoA instead showing 404
    }
  }
}

const setupNetwork = async () => {
  const network = useRouter().currentRoute.value.query?.network

  if (network && SUPPORTED_NETWORK_IDS.includes(network)) {
    selectedChainId.value = getNetworkById(network).chainId
  } else {
    console.warn(
      `Invalid network: ${network}, valid networks are ${SUPPORTED_NETWORK_IDS.join(
        ', '
      )}`
    )
  }
}

onMounted(async () => {
  setupTranslations()
  setupNetwork()
  await setupWeb3Instances()
  checkConnectionExpiry()
  await routerBackProfileLoad()
  await setupViewedProfile()

  isLoadedApp.value = true

  await setupCurrencies()
})

onUnmounted(() => {
  const provider = INJECTED_PROVIDER
  removeProviderEvents(provider)
})

useHead({
  bodyAttrs: {
    class: computed(() => {
      if (modal.value?.isOpen) {
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
