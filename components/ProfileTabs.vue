<script setup lang="ts">
type Props = {
  tabs?: ProfileViewTab[]
  activeTab?: FiltersAssetGroup
}

type Emits = (event: 'activate-tab', value: ProfileViewTab) => void

defineProps<Props>()
const emits = defineEmits<Emits>()
const { formatMessage } = useIntl()
const { isConnected, isConnectedUserViewingOwnProfile } =
  storeToRefs(useAppStore())
const { isEditingGrid } = storeToRefs(useGridStore())
const { connect } = useBaseProvider()

const handleToggleGridEditMode = async () => {
  if (!isConnected.value) {
    await connect()
    isEditingGrid.value = true
    return
  }

  isEditingGrid.value = !isEditingGrid.value
}
</script>

<template>
  <div
    class="mb-4 flex min-h-11 select-none items-center justify-between border-b border-b-neutral-90 pb-4"
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
    <template v-if="activeTab === 'grid' && isConnectedUserViewingOwnProfile">
      <lukso-tooltip
        variant="white"
        :text="isEditingGrid ? '' : formatMessage('grid_enable_edit_mode')"
        :show-delay="1500"
        placement="left"
      >
        <lukso-icon
          :name="isEditingGrid && isConnected ? 'close-lg' : 'edit'"
          @click="handleToggleGridEditMode"
          class="cursor-pointer opacity-50 transition hover:opacity-100"
        ></lukso-icon>
      </lukso-tooltip>
    </template>
  </div>
</template>
