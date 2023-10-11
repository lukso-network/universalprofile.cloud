<script setup lang="ts">
import { isAddress } from 'web3-utils'
import { SearchProfileResult } from '@lukso/web-components/dist/components/lukso-search'
import { storeToRefs } from 'pinia'

import { IndexedProfile } from '@/types/profile'

const SEARCH_COMPONENT_TAG_NAME = 'LUKSO-SEARCH'

const { search } = useAlgoliaSearch<IndexedProfile>(INDEX_NAME)
const { receiver, receiverError } = storeToRefs(useSendStore())
const isSearchingReceiver = ref<boolean>(false)
const searchTerm = ref<string>()
const hasNoResults = ref<boolean>(false)
const results = ref<SearchProfileResult[]>()
const selectedResultNumber = ref<number>()

onMounted(() => {
  window.addEventListener('click', handleOutsideSearchClick)
  window.addEventListener('keydown', handleSearchKeydown)
})

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideSearchClick)
  window.removeEventListener('keydown', handleSearchKeydown)
})

const handleOutsideSearchClick = (event: MouseEvent) => {
  const element = event.target as HTMLElement

  if (element.tagName !== SEARCH_COMPONENT_TAG_NAME) {
    hasNoResults.value = false
    results.value = undefined
  }
}

const handleClick = async () => {
  if (searchTerm.value) {
    await searchResults()
  }
}

const handleSearchKeydown = async (event: KeyboardEvent) => {
  if (
    event.key === 'ArrowUp' &&
    selectedResultNumber.value &&
    selectedResultNumber.value > 1
  ) {
    selectedResultNumber.value = selectedResultNumber.value - 1
  }

  if (event.key === 'ArrowDown' && results.value) {
    if (!selectedResultNumber.value) {
      selectedResultNumber.value = 1
    } else if (selectedResultNumber.value < results.value.length) {
      selectedResultNumber.value = selectedResultNumber.value + 1
    }
  }

  if (event.key === 'Enter') {
    if (results.value && selectedResultNumber.value) {
      const selectedResult = results.value[selectedResultNumber.value - 1]
      handleSelect({ detail: { value: selectedResult } } as CustomEvent)
    }
  }
}

const searchResults = async () => {
  selectedResultNumber.value = undefined
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
  searchTerm.value = address
  receiver.value = { address, name, profileImageUrl: image }
  receiverError.value = ''
  results.value = undefined
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
    :selected="selectedResultNumber"
    is-full-width
    class="w-full mt-4"
    custom-class="paragraph-ptmono-14-regular"
    @on-search="handleReceiverSearch"
    @on-select="handleSelect"
    @on-blur="handleBlur"
    @on-input-click="handleClick"
  ></lukso-search>
</template>
