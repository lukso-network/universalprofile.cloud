<script setup lang="ts">
import { EffectCoverflow, Navigation } from 'swiper/modules'
import { tv } from 'tailwind-variants'

import type { Swiper } from 'swiper'

type Props = {
  assets: Asset[]
}

const props = defineProps<Props>()
const { isMobile } = useDevice()
const activeIndex = ref(0)

const handleCardClick = (asset: Asset) => {
  navigateTo(tokenRoute(asset.address))
}

const isLoading = computed(() => props.assets?.some(asset => asset.isLoading))
const SLIDES_PER_VIEW = 3

const coverflowEffectOptions = {
  rotate: 50,
  stretch: 0,
  depth: 100,
  modifier: 1,
  slideShadows: false,
}

const handleInit = (swiper: Swiper) => {
  activeIndex.value = swiper.activeIndex
}

const handleSlideChange = (swiper: Swiper) => {
  activeIndex.value = swiper.activeIndex
}

const styleVariants = tv({
  slots: {
    bottomShadow:
      'absolute bottom-0 h-[50px] rounded-[850px] bg-neutral-20 opacity-30 blur-[34px]',
    leftShadow:
      'absolute bottom-[30px] left-[60px] h-[305px] w-[272px] rotate-90 rounded-[305px] bg-neutral-20 opacity-20 blur-[34px]',
    rightShadow:
      'absolute bottom-[30px] right-[60px] h-[305px] w-[272px] rotate-90 rounded-[305px] bg-neutral-20 opacity-20 blur-[34px]',
    leftNavigation:
      'absolute left-[20px] top-[calc(50%-45px)] z-10 cursor-pointer select-none rounded-8 border border-neutral-90 bg-neutral-100 p-2 transition hover:scale-[1.05] hover:border-neutral-80 active:scale-[0.99] lg:left-[-20px]',
    rightNavigation:
      'absolute right-[20px] top-[calc(50%-45px)] z-10 cursor-pointer select-none rounded-8 border border-neutral-90 bg-neutral-100 p-2 transition hover:scale-[1.05] hover:border-neutral-80 active:scale-[0.99] lg:right-[-20px]',
  },
  variants: {
    isSingleSlide: {
      true: {
        bottomShadow: 'left-[calc(50%-200px)] w-[400px]',
      },
      false: {
        bottomShadow: 'w-full',
      },
    },
    isLoading: {
      true: {
        leftNavigation: 'hidden',
        rightNavigation: 'hidden',
        bottomShadow: 'left-0 w-full',
        leftShadow: '!block',
        rightShadow: '!block',
      },
    },
    isMobile: {
      true: {
        bottomShadow: '!w-full',
        leftShadow: '!hidden',
        rightShadow: '!hidden',
      },
    },
  },
})

const styles = computed(() => {
  return styleVariants({
    isSingleSlide: props.assets.length === 1,
    isLoading: isLoading.value,
    isMobile,
  })
})
</script>

<template>
  <div class="relative">
    <!-- placeholder swiper when items are loading -->
    <Swiper
      v-if="isLoading"
      effect="coverflow"
      :grab-cursor="true"
      :centered-slides="false"
      :coverflow-effect="coverflowEffectOptions"
      :modules="[EffectCoverflow]"
      :slides-per-view="isMobile ? 1 : SLIDES_PER_VIEW"
      :loop="false"
      class="w-[calc(100vw-48px)] lg:w-full"
    >
      <SwiperSlide v-for="index in 6" :key="index" class="cursor-pointer pb-3"
        ><NftCard
      /></SwiperSlide>
    </Swiper>
    <!-- actual swiper with loaded items -->
    <Swiper
      v-else
      effect="coverflow"
      :grab-cursor="true"
      :centered-slides="true"
      :coverflow-effect="coverflowEffectOptions"
      :modules="[EffectCoverflow, Navigation]"
      :slides-per-view="isMobile ? 1 : SLIDES_PER_VIEW"
      :initial-slide="1"
      :loop="false"
      :navigation="{
        prevEl: '#prev',
        nextEl: '#next',
        disabledClass: 'hidden',
      }"
      class="w-[calc(100vw-48px)] lg:w-full"
      @init="handleInit"
      @slide-change="handleSlideChange"
    >
      <SwiperSlide
        v-for="asset in assets"
        :key="asset.address"
        class="cursor-pointer select-none pb-3"
        ><NftCard :asset="asset" @on-card-click="handleCardClick"
      /></SwiperSlide>
    </Swiper>
    <!-- navigation -->
    <lukso-icon
      name="arrow-left-lg"
      id="prev"
      :class="styles.leftNavigation()"
    ></lukso-icon>
    <lukso-icon
      name="arrow-right-lg"
      id="next"
      :class="styles.rightNavigation()"
    ></lukso-icon>

    <!-- circle shadows behind cards -->
    <div :class="styles.leftShadow()"></div>
    <div :class="styles.rightShadow()"></div>
    <!-- line shadow under cards -->
    <div :class="styles.bottomShadow()"></div>
  </div>
</template>
