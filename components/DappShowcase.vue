<script setup lang="ts">
import { Navigation, Pagination } from 'swiper/modules'

const SHOWCASE_ITEM_COUNT = 8

const handleCardClick = (url: string) => {
  navigateTo(url, {
    external: true,
    open: {
      target: '_blank',
    },
  })
}
</script>

<template>
  <div class="relative w-full pb-20">
    <div
      class="heading-inter-21-semi-bold flex items-center justify-center gap-2 pb-8"
    >
      {{ $formatMessage('dapp_showcase_title') }}
      <lukso-tag is-rounded>{{
        $formatMessage('dapp_showcase_built_on_lukso')
      }}</lukso-tag>
    </div>
    <Swiper
      :modules="[Navigation, Pagination]"
      :slides-per-view="1"
      :space-between="32"
      :loop="true"
      :navigation="{
        prevEl: '#prev',
        nextEl: '#next',
        disabledClass: 'hidden',
      }"
      :pagination="{
        clickable: true,
        bulletActiveClass: 'swiper-pagination-bullet-active !bg-neutral-50',
        bulletClass: 'swiper-pagination-bullet !bg-neutral-20',
        clickableClass: 'swiper-pagination-clickable',
      }"
      :breakpoints="{
        1400: {
          slidesPerView: 5,
        },
        1300: {
          slidesPerView: 4,
        },
        1024: {
          slidesPerView: 3,
        },
        468: {
          slidesPerView: 2,
        },
      }"
      class="w-[calc(100vw-48px)] max-w-[1200px] xl:w-full"
    >
      <SwiperSlide
        v-for="index in SHOWCASE_ITEM_COUNT"
        :key="index"
        class="cursor-pointer select-none pb-10"
        ><lukso-card
          variant="hero"
          shadow="small"
          border-radius="medium"
          is-hoverable
          :background-url="$formatMessage(`dapp_showcase_0${index}_image`)"
          @click="
            () => handleCardClick($formatMessage(`dapp_showcase_0${index}_url`))
          "
          :height="162"
          class="transition hover:scale-[1.005]"
        >
          <div
            slot="content"
            class="absolute inset-0 flex items-center justify-center rounded-[22px] bg-neutral-100/70 opacity-0 backdrop-blur-sm transition duration-300 hover:opacity-100"
          >
            <div class="paragraph-inter-16-semi-bold flex items-center gap-1">
              {{ $formatMessage(`dapp_showcase_0${index}_title`) }}
              <lukso-icon name="link-3"></lukso-icon>
            </div></div></lukso-card
      ></SwiperSlide>
    </Swiper>

    <!-- navigation -->
    <lukso-icon
      name="arrow-left-lg"
      id="prev"
      class="absolute left-[20px] top-[calc(50%-45px)] z-10 cursor-pointer select-none rounded-8 border border-neutral-90 bg-neutral-100 p-2 transition hover:scale-[1.05] hover:border-neutral-80 active:scale-[0.99] xl:left-[-60px]"
    ></lukso-icon>
    <lukso-icon
      name="arrow-right-lg"
      id="next"
      class="absolute right-[20px] top-[calc(50%-45px)] z-10 cursor-pointer select-none rounded-8 border border-neutral-90 bg-neutral-100 p-2 transition hover:scale-[1.05] hover:border-neutral-80 active:scale-[0.99] xl:right-[-60px]"
    ></lukso-icon>
  </div>
</template>
