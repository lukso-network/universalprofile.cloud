<script setup lang="ts">
type Props = {
  isSelected?: boolean
}

defineProps<Props>()
const { currentNetwork } = storeToRefs(useAppStore())
</script>

<template>
  <div
    class="grid cursor-pointer grid-cols-[max-content,auto] rounded-12 p-2 hover:bg-neutral-95"
    :class="{
      'bg-neutral-95': isSelected,
    }"
  >
    <div class="flex items-center pr-4">
      <div class="rounded-full shadow-neutral-above-shadow-1xl">
        <lukso-profile
          size="small"
          :profile-url="ASSET_LYX_ICON_URL"
        ></lukso-profile>
      </div>
    </div>
    <div class="grid grid-cols-[auto,max-content] items-center">
      <div class="flex flex-col text-left">
        <div class="paragraph-inter-14-semi-bold">
          {{ currentNetwork.token.name }}
        </div>
        <div class="paragraph-inter-12-semi-bold text-neutral-60">
          {{ currentNetwork.token.symbol }}
        </div>
      </div>
      <lukso-icon
        v-if="isSelected"
        name="complete-filled"
        color="green-54"
        secondary-color="neutral-100"
      ></lukso-icon>
    </div>
  </div>
</template>
