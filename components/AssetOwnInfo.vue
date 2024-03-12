<script setup lang="ts">
type Props = {
  address?: Address
  balance?: string
  symbol?: string
  decimals?: number
  profileImageUrl?: string
  message?: string
}

defineProps<Props>()
</script>

<template>
  <lukso-card
    is-full-width
    border-radius="small"
    shadow="small"
    class="mt-8 sm:mt-4"
  >
    <div slot="content" class="flex px-4 py-2">
      <lukso-profile
        size="small"
        :profile-address="address"
        :profile-url="profileImageUrl"
        has-identicon
      ></lukso-profile>
      <div class="flex flex-col justify-center pl-4">
        <div class="paragraph-inter-10-semi-bold pb-1">
          {{ message }}
        </div>
        <div class="paragraph-inter-12-semi-bold">
          <span v-if="balance">{{
            $formatNumber(fromWeiWithDecimals(balance, decimals), {
              maximumFractionDigits: decimals,
            })
          }}</span>
          <span v-else>0</span>
          <span class="ml-1 text-neutral-60">{{ symbol }}</span>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
