<script setup lang="ts">
type Props = {
  profileAddresses?: Address[]
}

type Slots = {
  default(props: { profiles: Profile[]; isLoading: boolean }): any
}

const props = defineProps<Props>()
defineSlots<Slots>()

const addresses = computed(() => props.profileAddresses)
const profilesData = useProfiles()(addresses)
const profiles = computed(() => profilesData.value?.profiles || [])
const isLoading = computed(() => profilesData.value?.isLoading || false)
</script>

<template>
  <slot :profiles="profiles" :is-loading="isLoading" />
</template>
