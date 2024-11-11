<script setup lang="ts">
const { formatMessage } = useIntl()
const { modal, closeModal } = useModal()
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <img
      :src="modal?.data?.icon || '/images/up-error.png'"
      class="mx-auto mb-6 mt-4 max-w-[150px]"
      alt=""
    />
    <div class="heading-inter-21-semi-bold pb-4">
      {{ modal?.data?.title || formatMessage('modal_default_title') }}
    </div>
    <div class="paragraph-inter-16-regular">
      <lukso-sanitize :html-content="modal?.data?.message"></lukso-sanitize>
    </div>
    <lukso-button
      variant="landing"
      is-full-width
      @click="closeModal"
      class="mt-6"
    >
      {{
        modal?.data?.confirmButtonText || formatMessage('modal_default_confirm')
      }}
    </lukso-button>
  </div>
</template>
