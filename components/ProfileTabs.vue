<script setup lang="ts">
type Props = {
  tabs?: ProfileViewTab[]
  activeTab?: FiltersAssetGroup
}

type Emits = (event: 'activate-tab', value: ProfileViewTab) => void

defineProps<Props>()
const emits = defineEmits<Emits>()
const { formatMessage } = useIntl()
const { isEditingGrid, isConnected, connectedProfileAddress } =
  storeToRefs(useAppStore())
const viewedProfileAddress = getCurrentProfileAddress()

const handleToggleGridEditMode = () => {
  isEditingGrid.value = !isEditingGrid.value
}
</script>

<template>
  <div
    class="mb-4 flex min-h-11 items-center justify-between border-b border-b-neutral-90 pb-4"
  >
    <ul class="flex justify-center gap-6 sm:justify-start">
      <ProfileTabsItem
        v-for="tab in tabs"
        :key="tab.id"
        :label="formatMessage(`profile_tab_${tab.id}`)"
        :count="tab.count"
        :is-active="tab.id === activeTab"
        @click="emits('activate-tab', tab)"
      />
    </ul>
    <template v-if="activeTab === 'grid'">
      <lukso-icon
        v-if="
          isConnected &&
          connectedProfileAddress?.toLowerCase() ===
            viewedProfileAddress?.toLowerCase()
        "
        :name="isEditingGrid ? 'close-lg' : 'edit'"
        @click="handleToggleGridEditMode"
        class="cursor-pointer transition hover:opacity-60"
      ></lukso-icon>
    </template>
  </div>
</template>
