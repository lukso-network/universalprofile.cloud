<template>
  <div class="min-h-[560px] md:mb-20">
    <div class="mb-5 flex h-[40px] items-center">
      <div class="heading-inter-21-semi-bold">
        {{ $formatMessage('network_activity_title') }}
      </div>
    </div>
    <iframe
      class="mx-[-20px] min-h-[508px] w-[calc(100%+20px)]"
      :src="TXS_APP_LUKSO_PAGE_URL"
    />
  </div>
</template>
