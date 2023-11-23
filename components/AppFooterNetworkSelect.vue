<script setup lang="ts">
import { SelectStringOption } from '@lukso/web-components'

const networks = ref<SelectStringOption[]>()
const selectedNetwork = ref<SelectStringOption>()
const { currentNetwork, selectedChainId } = storeToRefs(useAppStore())
const { disconnect } = useBrowserExtension()
const { isMobileOrTablet } = useDevice()

onMounted(() => {
  networks.value = NETWORKS.map(network => {
    return {
      id: network.chainId,
      value: network.name,
    }
  })
})

watchEffect(() => {
  selectedNetwork.value = {
    id: currentNetwork.value.chainId,
    value: currentNetwork.value.name,
  }
})

const handleNetworkChange = async (event: CustomEvent) => {
  const selectedNetwork = event.detail.value as SelectStringOption
  selectedNetwork.id && (selectedChainId.value = selectedNetwork.id)
  disconnect()
  await navigateTo(homeRoute())
  location.reload()
}
</script>

<template>
  <lukso-select
    :value="JSON.stringify(selectedNetwork)"
    :options="JSON.stringify(networks)"
    :open-top="!isMobileOrTablet ? true : undefined"
    :is-full-width="isMobileOrTablet ? true : undefined"
    class="sm:w-40"
    @on-select="handleNetworkChange"
  ></lukso-select>
</template>
