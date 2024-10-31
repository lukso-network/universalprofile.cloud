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

const handleNavigateMyUpDashboard = () => {
  navigateTo(myUpDappDashboardUrl(), { external: true })
}
</script>

<template>
  <lukso-navbar
    :is-testnet="isTestnet ? true : undefined"
    logo-url="/images/logo-ue.svg"
    is-sticky
    is-transparent
    has-menu
    mobile-breakpoint="md"
    @on-brand-click="handleNavigateLanding"
  >
    <!-- Desktop Menu -->
    <div class="flex items-center justify-end pr-4" slot="desktop-menu">
      <!-- Send assets -->
      <AppNavbarSendButton v-if="isConnected" />

      <!-- Profile -->
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

      <!-- Profile dropdown -->
      <AppNavbarProfileDropdown v-if="isConnected" />

      <!-- Connect -->
      <lukso-button
        v-else
        variant="landing"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        @click="handleConnect"
        :is-loading="isConnecting ? true : undefined"
        :loading-text="$formatMessage('header_connect')"
      >
        {{ $formatMessage('header_connect') }}
      </lukso-button>

      <!-- Settings -->
      <div
        v-if="!isConnected"
        class="ml-4 h-6 w-[1px] border-l border-purple-82 pl-4"
      >
        <lukso-icon
          name="settings"
          color="purple-41"
          class="cursor-pointer opacity-70 transition hover:rotate-45 hover:opacity-100"
          @click="handleNavigateSettings"
        ></lukso-icon>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div slot="mobile-menu">
      <div className="flex flex-col items-center justify-center h-screen pb-32">
        <!-- Send assets -->
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

        <!-- Profile -->
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

        <!-- Dashboard (my.up.cloud) -->
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleNavigateMyUpDashboard"
        >
          <span class="text-purple-63 transition group-hover:text-purple-41">
            {{ $formatMessage('header_relayer_dashboard') }}
          </span>
          <lukso-icon
            name="link-3"
            size="small"
            class="ml-2 group-hover:hidden"
            color="purple-63"
          ></lukso-icon>
          <lukso-icon
            name="link-3"
            size="small"
            class="ml-2 hidden group-hover:inline-block"
            color="purple-41"
          ></lukso-icon>
        </lukso-button>

        <!-- Settings -->
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

        <!-- Disconnect -->
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

        <!-- Connect -->
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

    <!-- Mobile Icons -->
    <div slot="mobile-icons" class="flex items-center">
      <lukso-icon
        name="search"
        class="cursor-pointer"
        @click="handleMobileSearch"
      ></lukso-icon>
      <lukso-button
        v-if="!isConnected"
        variant="landing"
        size="small"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        @click="handleConnect"
        :is-loading="isConnecting ? true : undefined"
        :loading-text="$formatMessage('header_connect')"
        class="ml-4 mr-1"
      >
        {{ $formatMessage('header_connect') }}
      </lukso-button>
      <AppNavbarAvatar
        v-if="isConnected"
        size="x-small"
        class="ml-4 mr-1 cursor-pointer"
        @click="handleNavigateProfile"
      />
    </div>
    <div slot="desktop-center" class="w-full">
      <AppNavbarProfileSearch />
    </div>
  </lukso-navbar>
  <AppNavbarMobileSearch v-if="isSearchOpen" />
</template>
