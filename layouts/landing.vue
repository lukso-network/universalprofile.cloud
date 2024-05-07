<template>
  <div
    class="relative bg-[url(/images/background.jpg)] bg-right-top bg-no-repeat sm:bg-top xl:bg-cover"
  >
    <div
      class="absolute inset-x-0 h-full bg-gradient-to-b from-transparent to-slate-50/100"
    ></div>
    <div
      class="relative z-[1] grid min-h-screen grid-rows-[max-content,auto,max-content]"
    >
      <AppNavbarLanding />
      <slot />
      <AppFooter />
    </div>
    <AppModal />
  </div>
</template>
