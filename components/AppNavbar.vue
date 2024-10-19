<script setup lang="ts">
const { disconnect } = useBaseProvider()
const viewedProfile = useProfile().viewedProfile()
const connectedProfile = useProfile().connectedProfile()
const { isConnecting, isConnected, isTestnet, isSearchOpen } =
  storeToRefs(useAppStore())
const { showModal } = useModal()

const handleNavigateProfile = async () => {
  try {
    if (isConnected.value) {
      navigateTo(profileRoute(connectedProfile.value?.address))
    } else {
      navigateTo(profileRoute(viewedProfile.value?.address))
    }
  } catch (error) {
    console.error(error)
    navigateTo(homeRoute())
  }
}

const handleNavigateSend = () => {
  navigateTo(sendRoute(connectedProfile.value?.address))
}

const handleConnect = () => {
  showModal({
    template: 'ConnectWallet',
    size: 'auto',
  })
}

const handleDisconnect = async () => {
  disconnect()
}

const handleNavigateLanding = () => {
  navigateTo(homeRoute())
}

const handleMobileSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
}

const handleNavigateSettings = () => {
  navigateTo(settingsRoute())
}
</script>

<template>
  <lukso-navbar
    :is-testnet="isTestnet ? true : undefined"
    logo-url="/images/logo-ue.svg"
    is-sticky
    is-transparent
    has-menu
    mobile-breakpoint="lg"
    @on-brand-click="handleNavigateLanding"
  >
    <div class="flex items-center justify-end" slot="desktop-menu">
      <AppNavbarSendButton v-if="isConnected" />
      <lukso-button
        v-if="isConnected"
        variant="text"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group"
        @click="handleNavigateProfile"
      >
        <span
          class="transition group-hover:text-purple-41"
          :class="{
            'text-purple-41': activePage('profileAddress'),
            'text-purple-63': !activePage('profileAddress'),
          }"
        >
          {{ $formatMessage('header_my_profile') }}
        </span>
      </lukso-button>
      <AppNavbarProfileDropdown v-if="isConnected" />
      <lukso-button
        v-else
        variant="secondary"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        @click="handleConnect"
        :is-loading="isConnecting ? true : undefined"
        :loading-text="$formatMessage('header_connect')"
      >
        <span class="text-purple-41">
          {{ $formatMessage('header_connect') }}
        </span>
      </lukso-button>
    </div>
    <div slot="mobile-menu">
      <div className="flex flex-col items-center justify-center h-screen pb-32">
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleNavigateSend"
        >
          <span
            class="transition group-hover:text-purple-41"
            :class="{
              'text-purple-41': activePage('profileAddress-send'),
              'text-purple-63': !activePage('profileAddress-send'),
            }"
          >
            {{ $formatMessage('header_send') }}
          </span>
        </lukso-button>
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleNavigateProfile"
        >
          <span
            class="transition group-hover:text-purple-41"
            :class="{
              'text-purple-41': activePage('profileAddress'),
              'text-purple-63': !activePage('profileAddress'),
            }"
          >
            {{ $formatMessage('header_my_profile') }}
          </span>
        </lukso-button>
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleNavigateSettings"
        >
          <span class="text-purple-63 transition group-hover:text-purple-41">
            {{ $formatMessage('header_settings') }}
          </span>
        </lukso-button>
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleDisconnect"
        >
          <span class="text-purple-63 transition group-hover:text-purple-41">
            {{ $formatMessage('header_disconnect') }}
          </span>
        </lukso-button>
        <lukso-button
          v-else
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleConnect"
        >
          <span class="text-purple-63 transition group-hover:text-purple-41">
            {{ $formatMessage('header_connect') }}
          </span>
        </lukso-button>
      </div>
    </div>
    <div slot="mobile-icons" class="flex">
      <lukso-icon
        name="search"
        class="cursor-pointer"
        @click="handleMobileSearch"
      ></lukso-icon>
    </div>
    <div slot="desktop-center" class="w-full">
      <AppNavbarProfileSearch />
    </div>
  </lukso-navbar>
  <AppNavbarMobileSearch v-if="isSearchOpen" />
</template>
