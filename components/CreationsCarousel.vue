<script setup lang="ts">
import { EffectCoverflow, Navigation } from 'swiper/modules'

type Props = {
  assets: Asset[]
}

defineProps<Props>()
const { isMobile } = useDevice()

const handleCardClick = (asset: Asset) => {
  navigateTo(tokenRoute(asset.address))
}
</script>

<template>
  <div class="relative">
    <Swiper
      effect="coverflow"
      :grab-cursor="true"
      :centered-slides="true"
      :coverflow-effect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false,
      }"
      :pagination="true"
      :modules="[EffectCoverflow, Navigation]"
      :slides-per-view="isMobile ? 1 : 3"
      :loop="true"
      :navigation="{
        prevEl: '#prev',
        nextEl: '#next',
      }"
      class="w-[calc(100vw-48px)] lg:w-full"
    >
      <SwiperSlide
        v-for="asset in assets"
        :key="asset.address"
        class="cursor-pointer pb-3"
        ><NftCard :asset="asset" @on-card-click="handleCardClick"
      /></SwiperSlide>
    </Swiper>
    <lukso-icon
      name="arrow-left-lg"
      id="prev"
      class="absolute left-[20px] top-[calc(50%-45px)] z-10 cursor-pointer select-none rounded-8 border border-neutral-90 bg-neutral-100 p-2 transition hover:scale-[1.03] hover:border-neutral-80 active:scale-[0.99] lg:left-[-20px]"
    ></lukso-icon>
    <lukso-icon
      name="arrow-right-lg"
      id="next"
      class="absolute right-[20px] top-[calc(50%-45px)] z-10 cursor-pointer select-none rounded-8 border border-neutral-90 bg-neutral-100 p-2 transition hover:scale-[1.03] hover:border-neutral-80 active:scale-[0.99] lg:right-[-20px]"
    ></lukso-icon>
    <div
      class="absolute bottom-0 h-[50px] w-full rounded-[850px] bg-neutral-20 opacity-30 blur-[34px]"
    ></div>
    <div
      class="absolute bottom-[30px] left-[60px] h-[305px] w-[272px] rotate-90 rounded-[305px] bg-neutral-20 opacity-20 blur-[34px]"
    ></div>
    <div
      class="absolute bottom-[30px] right-[60px] h-[305px] w-[272px] rotate-90 rounded-[305px] bg-neutral-20 opacity-20 blur-[34px]"
    ></div>
  </div>
</template>
