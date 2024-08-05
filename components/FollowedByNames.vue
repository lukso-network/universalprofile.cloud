Re
<script setup lang="ts">
import { sliceAddress } from '@lukso/web-components/tools'

type Props = {
  profileAddresses?: Address[]
}

type Slots = {
  default(props: { names: string; isLoading: boolean }): any
}

const props = defineProps<Props>()
defineSlots<Slots>()

const addresses = computed(() => props.profileAddresses)
const profilesData = useProfiles()(addresses)

const names = computed(() => {
  return (
    profilesData.value?.profiles
      .map((profile: Profile) => {
        if (profile?.name) {
          return `@${profile?.name}`
        }

        return sliceAddress(profile?.address, 4)
      })
      .join(', ') || ''
  )
})

const isLoading = computed(() => profilesData.value?.isLoading || false)
</script>

<template>
  <slot :names="names" :is-loading="isLoading" />
</template>
