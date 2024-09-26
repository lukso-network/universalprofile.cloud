<script setup lang="ts">
const { closeModal, modal } = useModal()
const { formatMessage } = useIntl()
const { removeGridLayoutItem } = useGrid()

const handleDelete = async () => {
  removeGridLayoutItem(modal?.data?.id)
  closeModal()
}
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <div class="heading-inter-21-semi-bold pb-4">
      {{ formatMessage('modal_delete_widget_title') }}
    </div>
    <div class="paragraph-inter-16-regular">
      <lukso-sanitize
        :html-content="formatMessage('modal_delete_widget_content')"
      ></lukso-sanitize>
    </div>
    <div class="grid grid-cols-[max-content,auto]">
      <lukso-button variant="text" @click="closeModal" class="mt-6">
        {{ formatMessage('modal_delete_widget_cancel') }}
      </lukso-button>
      <lukso-button
        variant="danger"
        is-full-width
        @click="handleDelete"
        class="mt-6"
      >
        {{ formatMessage('modal_delete_widget_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
