<script setup lang="ts">
const handleCardClick = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="w-full pb-20">
    <div class="heading-inter-21-semi-bold pb-8">
      {{ $formatMessage('dapp_showcase_title') }}
    </div>
    <div
      class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16"
    >
      <lukso-card
        variant="dapp"
        shadow="small"
        is-hoverable
        custom-class="rounded-24 shadow-neutral-drop-shadow"
        v-for="index in DAPP_SHOWCASE_COUNT"
        :key="index"
        :background-url="$formatMessage(`dapp_showcase_0${index}_image`)"
        @click="
          () => handleCardClick($formatMessage(`dapp_showcase_0${index}_url`))
        "
        class="transition hover:scale-[1.01] active:scale-[1.005]"
      >
        <div slot="content" class="px-6 py-4">
          <div class="paragraph-inter-16-semi-bold flex justify-between">
            {{ $formatMessage(`dapp_showcase_0${index}_title`) }}
            <lukso-icon name="link-3"></lukso-icon>
          </div>
          <div class="paragraph-inter-14-regular pt-1">
            {{ $formatMessage(`dapp_showcase_0${index}_description`) }}
          </div>
        </div>
      </lukso-card>
    </div>
  </div>
</template>
