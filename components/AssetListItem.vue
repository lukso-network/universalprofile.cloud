<script setup lang="ts">
type Props = {
  icon?: string
  name?: string
  symbol?: string
  address?: Address
  hasIdenticon?: boolean
  hasSquareIcon?: boolean
  isSelected?: boolean
}

defineProps<Props>()
</script>

<template>
  <div
    class="grid grid-cols-[max-content,auto] p-2 rounded-12 cursor-pointer hover:bg-neutral-95"
    :class="{
      'bg-neutral-95': isSelected,
    }"
  >
    <div class="pr-4 flex items-center">
      <div
        class="shadow-neutral-above-shadow-1xl"
        :class="{
          'rounded-full': !hasSquareIcon,
          'rounded-4': hasSquareIcon,
        }"
      >
        <lukso-profile
          size="small"
          :profile-url="icon"
          :profile-address="address"
          :has-identicon="hasIdenticon ? true : undefined"
          :is-square="hasSquareIcon ? true : undefined"
        ></lukso-profile>
      </div>
    </div>
    <div class="grid grid-cols-[auto,max-content] items-center">
      <div class="flex flex-col text-left">
        <div class="paragraph-inter-14-semi-bold">
          {{ name }}
        </div>
        <div class="paragraph-inter-12-semi-bold text-neutral-60">
          {{ symbol }}
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
