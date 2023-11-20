<template>
  <div
    class="grid min-h-screen grid-rows-[max-content,auto,max-content] bg-gradient-to-b from-[rgba(144,155,209,0.10)] via-[rgba(223,184,226,0.10)] to-[rgba(250,224,227,0.10)]"
  >
    <AppNavbar />
    <slot />
    <AppFooter />
  </div>
</template>
