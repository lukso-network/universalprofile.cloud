<script setup lang="ts">
type Props = {
  address: Address
}

defineProps<Props>()
</script>

<template>
  <div
    class="mx-auto flex h-full max-w-72 flex-col items-center justify-center text-center"
  >
    <img src="/images/up-error.png" alt="" class="mb-6 w-36" />
    <div class="heading-inter-21-semi-bold mb-4">
      {{ $formatMessage('not_up_title') }}
    </div>
    <div class="paragraph-inter-16-regular mb-6">
      {{ $formatMessage('not_up_description') }}
    </div>
    <lukso-button
      variant="landing"
      is-link
      :href="explorerContractUrl(address)"
      class="mb-8"
      >{{ $formatMessage('not_up_button') }}</lukso-button
    >
  </div>
</template>
