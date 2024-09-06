<script setup lang="ts">
const { formatMessage } = useIntl()
const { filters, setFilters } = useFilters()

type Props = {
  closeModal: () => void
}

const props = defineProps<Props>()
const searchTerm = ref<string>('')

const handleChangeSearch = async (customEvent: CustomEvent) => {
  const value = customEvent.detail?.value
  searchTerm.value = value
}

const handleResetSearch = () => {
  searchTerm.value = ''
}

const confirmModal = () => {
  setFilters({ search: searchTerm.value })
  props.closeModal()
}

onMounted(() => {
  searchTerm.value = filters.search || ''
})
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 px-6 py-8 text-center">
    <lukso-search
      .value="searchTerm"
      is-full-width
      hide-loading
      has-reset
      :placeholder="formatMessage('modal_mobile_search_placeholder')"
      @on-search="handleChangeSearch"
      @on-reset="handleResetSearch"
    >
    </lukso-search>
    <div class="mt-6 flex gap-2">
      <lukso-button variant="text" @click="closeModal">
        {{ formatMessage('modal_mobile_search_cancel') }}
      </lukso-button>
      <lukso-button variant="landing" is-full-width @click="confirmModal">
        {{ formatMessage('modal_mobile_search_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
