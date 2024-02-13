<script setup lang="ts">
const { formatMessage } = useIntl()

const handleVisitHomepage = () => {
  navigateTo(homeRoute())
}

const handleGetHelp = () => {
  window.open(formatMessage('not_found_get_help_url'), '_blank')
}
</script>

<template>
  <div
    class="flex h-full animate-fade-in flex-col items-center justify-center transition-opacity"
  >
    <img
      src="/images/up-error-large.png"
      alt=""
      class="w-full px-20 sm:w-[341px] sm:px-0"
    />
    <div class="heading-apax-24-medium pb-2">
      {{ $formatMessage('not_found_title') }}
    </div>
    <div class="paragraph-inter-16-regular pb-10 text-center">
      {{ $formatMessage('not_found_text') }}
    </div>
    <div class="grid w-full gap-4 sm:w-auto sm:grid-cols-2">
      <lukso-button
        variant="landing"
        @click="handleVisitHomepage"
        is-full-width
      >
        {{ $formatMessage('not_found_homepage') }}
      </lukso-button>
      <lukso-button variant="text" @click="handleGetHelp" is-full-width>
        {{ $formatMessage('not_found_get_help') }}
      </lukso-button>
    </div>
  </div>
</template>
