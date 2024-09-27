<script setup lang="ts">
type Props = {
  tabs?: ProfileViewTab[]
  activeTab?: FiltersAssetGroup
}

type Emits = (event: 'activate-tab', value: ProfileViewTab) => void

defineProps<Props>()
const emits = defineEmits<Emits>()
const { formatMessage } = useIntl()
const { isEditingGrid, isConnected } = storeToRefs(useAppStore())

const handleToggleGridEditMode = () => {
  isEditingGrid.value = !isEditingGrid.value
}
</script>

<template>
  <div
    class="mb-4 flex min-h-6 items-center justify-between border-b border-b-neutral-90 pb-4"
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
    <lukso-icon
      v-if="activeTab === 'grid' && isConnected"
      name="edit"
      @click="handleToggleGridEditMode"
      class="cursor-pointer transition hover:opacity-60"
    ></lukso-icon>
  </div>
</template>
