<script setup lang="ts">
import { isAddress } from 'web3-utils'
import { SearchProfileResult } from '@lukso/web-components/dist/components/lukso-search'
import { storeToRefs } from 'pinia'

import { IndexedProfile } from '@/types/profile'

const { search } = useAlgoliaSearch<IndexedProfile>(INDEX_NAME)
const { receiver, receiverError } = storeToRefs(useSendStore())
const isSearchingReceiver = ref<boolean>(false)
const searchTerm = ref<string>()
const hasNoResults = ref<boolean>(false)

const results = ref<SearchProfileResult[]>()

onMounted(() => {
  window.addEventListener('click', handleOutsideSearchClick)
})

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideSearchClick)
})

const handleOutsideSearchClick = async () => {
  hasNoResults.value = false
  results.value = undefined
}

const searchResults = async () => {
  const searchResults = await search({
    query: searchTerm.value,
    requestOptions: {
      hitsPerPage: SEARCH_RESULTS_LIMIT,
      page: 0,
    },
  })

  if (searchResults.hits.length === 0) {
    hasNoResults.value = true
    return
  } else {
    hasNoResults.value = false
  }

  results.value = searchResults.hits.map(hit => {
    return {
      name: hit.LSP3Profile?.name,
      address: hit.address,
      image: hit.profileImageUrl,
    }
  })
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

  // in user paste address, which might be EoA, we load profile right away
  if (isAddress(searchTerm.value)) {
    assertAddress(searchTerm.value)

    try {
      await fetchProfile(searchTerm.value)
    } catch (error) {
      if (error instanceof EoAError) {
        receiver.value = { address: searchTerm.value }
        receiver.value.isEoa = true
        receiver.value.address = searchTerm.value
      }

      console.error(error)
    }
  } else {
    receiver.value = undefined
  }

  await searchResults()
  isSearchingReceiver.value = false
}

const handleSelect = async (event: CustomEvent) => {
  const selection = event.detail.value
  const { address, name, image } = selection
  results.value = undefined
  searchTerm.value = address
  receiver.value = { address, name, profileImageUrl: image }
  receiverError.value = ''
}

const handleBlur = () => {
  const { formatMessage } = useIntl()

  // we add slight delay to allow `on-select` to be triggered first
  setTimeout(() => {
    if (searchTerm.value && !isAddress(searchTerm.value)) {
      receiverError.value = formatMessage('errors_invalid_address')
    } else {
      receiverError.value = ''
    }
  }, 300)
}
</script>

<template>
  <lukso-search
    name="receiver"
    :value="searchTerm"
    :placeholder="$formatMessage('send_input_placeholder')"
    :error="receiverError"
    :results="JSON.stringify(results)"
    :is-searching="isSearchingReceiver ? 'true' : undefined"
    :show-no-results="hasNoResults ? 'true' : undefined"
    :no-results-text="$formatMessage('profile_search_no_results')"
    is-full-width
    class="w-full mt-4"
    custom-class="paragraph-ptmono-14-regular"
    @on-search="handleReceiverSearch"
    @on-select="handleSelect"
    @on-blur="handleBlur"
  ></lukso-search>
</template>
