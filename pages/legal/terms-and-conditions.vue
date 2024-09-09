<script setup lang="ts">
const { formatMessage } = useIntl()
</script>

<template>
  <AppPageLoader>
    <div class="mx-auto max-w-content">
      <h1 class="heading-inter-26-semi-bold mb-8">
        {{ formatMessage('pages_terms_title') }}
      </h1>
      <lukso-sanitize
        :html-content="formatMessage('pages_terms_content')"
      ></lukso-sanitize>
    </div>
  </AppPageLoader>
</template>
