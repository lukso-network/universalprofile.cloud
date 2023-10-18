<script setup lang="ts">
import { Asset } from '@/types/assets'

type Props = {
  asset: Asset
}

const props = defineProps<Props>()

const handleOpenCreator = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(props.asset.creatorAddress)
    navigateTo(profileRoute(props.asset.creatorAddress))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div
    v-if="asset.creatorAddress"
    class="cursor-pointer shadow-neutral-drop-shadow p-2 pr-6 rounded-4 inline-flex bg-neutral-100 transition hover:scale-105"
    @click="handleOpenCreator"
  >
    <lukso-profile
      size="x-small"
      :profile-url="asset.creatorProfileImage"
    ></lukso-profile>
    <div class="pl-1">
      <div class="text-neutral-60 paragraph-inter-10-semi-bold">
        {{ $formatMessage('asset_created_by') }}
      </div>
      <lukso-username
        :name="asset.creatorName"
        :address="asset.creatorAddress"
        size="x-small"
        class="flex"
        name-color="neutral-20"
      ></lukso-username>
    </div>
  </div>
</template>
