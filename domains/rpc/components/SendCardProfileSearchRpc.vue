<script setup lang="ts">
import { isAddress } from 'web3-utils'

import type { SearchProfileResult } from '@lukso/web-components'

const BLUR_DELAY = 100

const { currentNetwork } = storeToRefs(useAppStore())
const { search } = useAlgoliaSearch<IndexedProfile>(
  currentNetwork.value.indexName
)
const { receiver } = storeToRefs(useSendStore())
const isSearchingReceiver = ref<boolean>(false)
const searchTerm = ref<string | Address>(receiver.value?.address || '')
const hasNoResults = ref<boolean>(false)
const results = ref<SearchProfileResult[]>()

const searchResults = async () => {
  const searchResults = await searchProfile(searchTerm.value)

  if (!searchResults || searchResults?.length === 0) {
    hasNoResults.value = true
    return
  }

  hasNoResults.value = false
  results.value = []

  for (const hit of searchResults) {
    results.value.push({
      name: hit.LSP3Profile?.name,
      address: hit?.address,
      image: hit.profileImageUrl,
    })
  }
}

const handleReceiverSearch = async (event: CustomEvent) => {
  searchTerm.value = event.detail.value
  results.value = undefined

  if (!searchTerm.value) {
    isSearchingReceiver.value = false
    hasNoResults.value = false
    results.value = undefined
    receiver.value = undefined
    return
  }

  isSearchingReceiver.value = true
  await searchResults()

  if (hasNoResults.value && isAddress(searchTerm.value)) {
    // addresses which might be EoA, or not in index, we show in the results
    results.value = [
      {
        address: searchTerm.value as Address,
      },
    ]
    hasNoResults.value = false
  }

  isSearchingReceiver.value = false
}

const selectProfile = async (address?: Address) => {
  const searchResults = await searchProfile(address)

  if (!searchResults || searchResults.length === 0) {
    if (searchTerm.value && isAddress(searchTerm.value)) {
      // profile might be not indexed
      receiver.value = {
        address: searchTerm.value as Address,
        standard: 'EOA',
      }
      hasNoResults.value = false
      isSearchingReceiver.value = false
      return
    }

    return
  }

  results.value = undefined

  const selectedProfile = await (async () => {
    for (const hit of searchResults) {
      return {
        name: hit.LSP3Profile?.name,
        address: hit?.address,
        image: hit.profileImageUrl,
      }
    }
  })()

  receiver.value = {
    address,
    name: selectedProfile?.name,
    profileImage: [
      {
        src: selectedProfile?.image,
      },
    ],
  }
}

const searchProfile = async (searchTerm?: string) => {
  if (!searchTerm) {
    return
  }

  const searchResults = await search({
    query: searchTerm,
    requestOptions: {
      hitsPerPage: SEARCH_RESULTS_LIMIT,
      page: 0,
    },
  })
  const profiles = searchResults?.hits

  if (profileLog.enabled) {
    profileLog('profileSearch', profiles)
  }

  return profiles
}

const handleSelect = async (event: CustomEvent) => {
  const selection = event.detail.value as SearchProfileResult
  const { address } = selection
  searchTerm.value = address
  await selectProfile(address)
}

const handleBlur = async (customEvent: CustomEvent) => {
  const address = customEvent.detail.value as Address

  // we add slight delay to allow `on-select` to be triggered first
  setTimeout(async () => {
    if (isAddress(address)) {
      await selectProfile(address)
    }
  }, BLUR_DELAY)
}
</script>

<template>
  <lukso-search
    name="receiver"
    :value="searchTerm"
    :placeholder="$formatMessage('send_input_placeholder')"
    :results="JSON.stringify(results)"
    :is-searching="isSearchingReceiver ? 'true' : undefined"
    :show-no-results="hasNoResults ? 'true' : undefined"
    :no-results-text="$formatMessage('profile_search_no_results')"
    is-full-width
    class="mt-4 w-full"
    custom-class="paragraph-ptmono-14-regular"
    @on-search="handleReceiverSearch"
    @on-input-click="handleReceiverSearch"
    @on-select="handleSelect"
    @on-blur="handleBlur"
  ></lukso-search>
</template>
