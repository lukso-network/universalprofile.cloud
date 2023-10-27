<script setup lang="ts">
type Props = {
  address?: Address
  amount?: string
  symbol?: string
  decimals?: number
}

const props = defineProps<Props>()
const { profileImage } = useProfile(props)
</script>

<template>
  <lukso-card is-full-width size="small" class="mt-4">
    <div slot="content" class="px-4 py-2 flex">
      <lukso-profile
        size="small"
        :profile-address="address"
        :profile-url="profileImage?.base64"
        has-identicon
      ></lukso-profile>
      <div class="pl-4 flex flex-col justify-center">
        <div class="paragraph-inter-10-semi-bold pb-1">
          {{ $formatMessage('token_details_own') }}
        </div>
        <div class="paragraph-inter-12-semi-bold">
          <span v-if="amount">{{
            $formatNumber(fromWeiWithDecimals(amount, decimals), {
              maximumFractionDigits: decimals,
            })
          }}</span>
          <span v-else>0</span>
          <span class="text-neutral-60 ml-1">{{ symbol }}</span>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
