<script setup lang="ts">
import { fetchProfile } from '@/utils/fetchProfile'
import { PROVIDERS } from '@/types/enums'

if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

// setup translations
useIntl().setupIntl(defaultConfig)

// setup web3 instances
const web3Store = useWeb3Store()
const appStore = useAppStore()
const provider = window.ethereum
if (provider) {
  web3Store.addWeb3(PROVIDERS.INJECTED, provider) // for chain interactions through wallet
}
web3Store.addWeb3(
  PROVIDERS.RPC,
  appStore.getNetwork(appStore.selectedNetwork).rpcHttp
) // for chain interactions through RPC endpoint

onMounted(async () => {
  const { setLoading } = useProfileStore()
  try {
    setLoading(true)
    // fetching profile in root as it's used in every page
    await fetchProfile()
  } catch (error) {
    console.error(error)
    // TODO redirect to 404 page once it's added
  } finally {
    setLoading(false)
  }
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
