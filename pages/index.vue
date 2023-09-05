<script setup lang="ts">
definePageMeta({
  layout: 'landing',
})
</script>

<template>
  <div>
    <div
      class="max-w-[950px] py-20 pt-24 px-4 mx-auto relative grid grid-cols-2 gap-7"
    >
      <div>
        <img src="/images/wallet.png" alt="" class="max-w-[484px]" />
      </div>
      <div>
        <lukso-card is-full-width>
          <div slot="content" class="p-10 pt-16 relative">
            <img
              src="/images/up-cube.png"
              alt=""
              class="w-[100px] absolute -top-[50px]"
            />
            <div class="heading-apax-24-medium">
              {{ $formatMessage('landing_hero_title') }}
            </div>
            <div class="paragraph-inter-16-regular pt-6">
              <lukso-sanitize
                :html-content="$formatMessage('landing_hero_description')"
              ></lukso-sanitize>
            </div>
          </div>
        </lukso-card>
      </div>
    </div>
  </div>
</template>
