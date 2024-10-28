<script setup lang="ts">
const { isTestnet, isConnected, connectedProfileAddress } =
  storeToRefs(useAppStore())
const { disconnect } = useBaseProvider()
const { showModal } = useModal()

const handleConnect = async () => {
  showModal({
    template: 'ConnectWallet',
    size: 'auto',
  })
}

const handleDisconnect = async () => {
  disconnect()
}

const handleNavigateSettings = () => {
  navigateTo(settingsRoute())
}

const handleNavigateProfile = async () => {
  navigateTo(profileRoute(connectedProfileAddress.value))
}

const handleNavigateMyUpDashboard = () => {
  navigateTo(myUpDappDashboardUrl(), { external: true })
}
</script>

<template>
  <lukso-navbar
    :is-testnet="isTestnet ? true : undefined"
    logo-url="/images/logo-ue.svg"
    is-transparent
    has-menu
    mobile-breakpoint="lg"
  >
    <!-- Desktop Menu -->
    <div
      class="flex w-full items-center justify-end gap-4 pr-4"
      slot="desktop-menu"
    >
      <!-- L14 Profiles -->
      <lukso-button
        variant="text"
        is-link
        :href="BASE_L14_UP_CLOUD_URL"
        target="_self"
        custom-class="text-12 nav-apax-12-medium-uppercase px-2"
        class="group"
      >
        <span class="text-purple-51 transition group-hover:text-purple-41">
          {{ $formatMessage('button_l14_profiles') }}
        </span>
        <lukso-icon
          name="link-3"
          size="small"
          class="ml-2"
          color="purple-51"
        ></lukso-icon>
      </lukso-button>

      <!-- Support -->
      <lukso-button
        variant="text"
        is-link
        href="https://support.lukso.network/"
        target="_blank"
        custom-class="text-12 nav-apax-12-medium-uppercase pl-2 pr-4"
        class="group"
      >
        <span class="text-purple-51 transition group-hover:text-purple-41">
          {{ $formatMessage('footer_need_help_text') }}
        </span>
      </lukso-button>

      <!-- Create Profile -->
      <lukso-button
        variant="secondary"
        is-link
        :href="myUpDappBaseUrl()"
        target="_self"
        custom-class="bg-transparent text-purple-51 p-0 border-0"
      >
        <span
          class="nav-apax-12-medium-uppercase flex h-12 items-center rounded-12 border !border-purple-51 px-6"
        >
          {{
            $formatMessage(
              `button_create_${isTestnet ? 'testnet_' : ''}profile`
            )
          }}
        </span>
      </lukso-button>

      <!-- Profile dropdown -->
      <AppNavbarProfileDropdown v-if="isConnected" />

      <!-- Connect -->
      <lukso-button
        v-else
        variant="landing"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group"
        @click="handleConnect"
      >
        {{ $formatMessage('header_connect') }}
      </lukso-button>

      <!-- Settings -->
      <div
        v-if="!isConnected"
        class="h-6 w-[1px] border-l border-purple-82 pl-4"
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
        <!-- L14 Profiles -->
        <lukso-button
          variant="text"
          custom-class="no-underline"
          is-link
          :href="BASE_L14_UP_CLOUD_URL"
          target="_self"
          class="group"
        >
          <span
            class="nav-apax-12-medium-uppercase text-purple-63 group-hover:text-purple-41"
          >
            {{ $formatMessage('button_l14_profiles') }}
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

        <!-- Support -->
        <lukso-button
          variant="text"
          is-link
          href="https://support.lukso.network/"
          target="_blank"
          custom-class="no-underline"
          class="group"
        >
          <span
            class="nav-apax-12-medium-uppercase text-purple-63 group-hover:text-purple-41"
          >
            {{ $formatMessage('footer_need_help_text') }}
          </span>
        </lukso-button>

        <!-- Create Profile -->
        <lukso-button
          variant="text"
          custom-class="no-underline"
          is-link
          :href="myUpDappBaseUrl()"
          target="_self"
          class="group"
        >
          <span
            class="nav-apax-12-medium-uppercase text-purple-63 group-hover:text-purple-41"
          >
            {{
              $formatMessage(
                `button_create_${isTestnet ? 'testnet_' : ''}profile`
              )
            }}
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

        <!-- Profile -->
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleNavigateProfile"
        >
          <span class="text-purple-63 transition group-hover:text-purple-41">
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
  </lukso-navbar>
</template>
