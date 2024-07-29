<script setup lang="ts">
import type {
  ProfileViewTab,
  ProfileViewTabName,
} from '@/domains/graph/components/ProfileViewGraph.vue'

type Props = {
  tabs?: ProfileViewTab[]
  activeTab?: ProfileViewTabName
}

type Emits = (event: 'activate-tab', value: ProfileViewTabName) => void

defineProps<Props>()
const emits = defineEmits<Emits>()
const { formatMessage } = useIntl()
</script>

<template>
  <ul class="mb-4 flex gap-6 border-b border-b-neutral-90 pb-4">
    <ProfileTabsItem
      v-for="tab in tabs"
      :key="tab.id"
      :label="formatMessage(`profile_tab_${tab.id}`)"
      :count="tab.count"
      :is-active="tab.id === activeTab"
      @click="emits('activate-tab', tab.id)"
    />
  </ul>
</template>
