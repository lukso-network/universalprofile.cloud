<script setup lang="ts">
type Props = {
  tabs?: ProfileViewTab[]
  activeTab?: FiltersAssetGroup
}

type Emits = (event: 'activate-tab', value: ProfileViewTab) => void

defineProps<Props>()
const emits = defineEmits<Emits>()
const { formatMessage } = useIntl()
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
  </div>
</template>
