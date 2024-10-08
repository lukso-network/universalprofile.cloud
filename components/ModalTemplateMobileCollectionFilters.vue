<script setup lang="ts">
import type { FiltersAttribute } from '@/types/filters'
import type { SelectStringOption } from '@lukso/web-components'

const { formatMessage } = useIntl()
const { filters, setFilters, attributeFilterOptions } = useFilters()
const { closeModal } = useModal()

const address = useRouter().currentRoute.value.params?.collectionAddress
const selectedAttributes = ref<SelectStringOption[]>([])
const { data: attributesData, isLoading: isLoadingAttributes } =
  useCollectionAttributesGraph({
    address,
  })

const confirmModal = async () => {
  const attributes =
    selectedAttributes.value.length > 0
      ? JSON.stringify(
          selectedAttributes.value?.map(attribute => ({
            group: attribute.group,
            value: attribute.value,
          }))
        )
      : undefined

  await setFilters({
    attributes,
  })
  await closeModal()
}

const handleSelectAttribute = (customEvent: CustomEvent) => {
  const attribute = customEvent.detail?.value as SelectStringOption

  if (selectedAttributes.value.some(value => value.id === attribute.id)) {
    selectedAttributes.value = selectedAttributes.value.filter(
      value => value.id !== attribute.id
    )
  } else {
    selectedAttributes.value = [...selectedAttributes.value, attribute]
  }
}

onMounted(() => {
  selectedAttributes.value = filters?.attributes
    ? (JSON.parse(filters.attributes) as FiltersAttribute[])?.map(
        attribute => ({
          id: slug(`${attribute.group}-${attribute.value}`),
          value: attribute.value,
          group: attribute.group,
        })
      ) || []
    : []
})
</script>

<template>
  <div
    class="flex flex-col gap-2 rounded-12 bg-neutral-98 px-6 py-8 text-center"
  >
    <!-- Attributes loading state -->
    <div v-if="isLoadingAttributes" class="flex gap-2">
      <AppPlaceholderLine class="h-[28px] w-[100px] rounded-8" />
      <AppPlaceholderLine class="h-[28px] w-[100px] rounded-8" />
      <AppPlaceholderLine class="h-[28px] w-[100px] rounded-8" />
    </div>

    <!-- Attributes filter -->
    <div
      class="-mx-4 grid max-h-[calc(100vh-300px)] grid-cols-1 gap-2 overflow-y-auto px-4"
    >
      <lukso-select
        v-for="attribute in attributesData?.attributes"
        :key="attribute.id"
        size="medium"
        :placeholder="attribute.group"
        show-selection-counter
        is-full-width
        :options="JSON.stringify(attributeFilterOptions(attribute))"
        :value="
          JSON.stringify(
            selectedAttributes.filter(
              value =>
                value.group === attribute.group &&
                attribute.values.includes(value.value)
            )
          )
        "
        @on-select="handleSelectAttribute"
      ></lukso-select>
    </div>

    <!-- Buttons -->
    <div class="mt-4 flex gap-2">
      <lukso-button variant="text" @click="closeModal">
        {{ formatMessage('modal_mobile_filter_cancel') }}
      </lukso-button>
      <lukso-button variant="landing" is-full-width @click="confirmModal">
        {{ formatMessage('modal_mobile_filter_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
