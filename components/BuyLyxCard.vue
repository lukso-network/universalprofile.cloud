<script setup lang="ts">
type Props = {
  logoUrl: string
  buyUrl: string
  description: string
}

const props = defineProps<Props>()

const handleBuyLyx = () => {
  window.open(props.buyUrl, '_blank')
}
</script>

<template>
  <lukso-card
    border-radius="small"
    shadow="small"
    is-hoverable
    @click="handleBuyLyx"
  >
    <div slot="content" class="p-6">
      <div class="grid grid-cols-[auto,max-content]">
        <img :src="logoUrl" class="max-w-[100px]" />
        <lukso-button
          size="small"
          :href="buyUrl"
          target="_blank"
          variant="secondary"
          is-link
        >
          {{ $formatMessage('buy_lyx_card_buy_button') }}
        </lukso-button>
      </div>
      <div class="paragraph-inter-14-regular mt-4">{{ description }}</div>
    </div>
  </lukso-card>
</template>
