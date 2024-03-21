<script setup lang="ts">
const { amount, asset } = storeToRefs(useSendStore())
</script>

<template>
  <lukso-card variant="with-header" is-full-width>
    <div slot="header" class="flex flex-col px-6 py-10">
      <SendCardHeader />
    </div>
    <div slot="content" class="flex flex-col items-center p-8">
      <div class="heading-inter-17-semi-bold">
        {{
          $formatMessage('send_pending_title', {
            amount: amount || '0',
            symbol: asset?.tokenSymbol || '',
          })
        }}
      </div>
      <lukso-icon
        name="progress-indicator"
        size="x-large"
        class="mt-6"
      ></lukso-icon>
    </div>
  </lukso-card>
</template>
