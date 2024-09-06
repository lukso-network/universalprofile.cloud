<script setup lang="ts">
const { formatMessage } = useIntl()
const { closeModal } = useModal()
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <img src="/images/lukso.svg" class="mx-auto mb-6 max-w-[150px]" alt="" />
    <div class="heading-inter-21-semi-bold pb-4">
      {{ formatMessage('transak_success_title') }}
    </div>
    <div class="paragraph-inter-16-regular">
      <lukso-sanitize
        :html-content="formatMessage('transak_success_message')"
      ></lukso-sanitize>
    </div>
    <lukso-button
      variant="landing"
      is-full-width
      @click="closeModal"
      class="mt-6"
    >
      {{ formatMessage('transak_success_button') }}
    </lukso-button>
  </div>
</template>
