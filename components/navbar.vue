<script setup lang="ts">
import { profileRoute, sendRoute } from '@/shared/routes'

const { profile, status } = useConnectionStore()
const { connect, disconnect } = useBrowserExtension()
const { reloadProfile } = useProfileStore()

const handleNavigateProfile = async () => {
  try {
    assertAddress(profile.address)
    reloadProfile(profile.address, profile)
    navigateTo(profileRoute(profile.address))
  } catch (error) {
    console.error(error)
  }
}

const handleNavigateSend = () => {
  try {
    assertAddress(profile.address)
    navigateTo(sendRoute(profile.address))
  } catch (error) {
    console.error(error)
  }
}

const handleConnect = async () => {
  connect()
}

const handleDisconnect = async () => {
  disconnect()
}
</script>

<template>
  <lukso-navbar
    is-sticky
    :title="$formatMessage('header_title')"
    @on-brand-click="handleNavigateProfile"
  >
    <div class="w-full flex items-center justify-end" slot="desktop">
      <lukso-button
        v-if="status.isConnected"
        variant="text"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        @click="handleNavigateSend"
      >
        {{ $formatMessage('header_send') }}
      </lukso-button>
      <lukso-button
        v-if="status.isConnected"
        variant="text"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        @click="handleNavigateProfile"
      >
        {{ $formatMessage('header_my_profile') }}
      </lukso-button>
      <ProfileDropdown v-if="status.isConnected" />
      <lukso-button
        v-else
        variant="secondary"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        @click="handleConnect"
      >
        {{ $formatMessage('header_connect') }}
      </lukso-button>
    </div>
    <div slot="mobile">
      <div className="flex flex-col items-center justify-center h-screen pb-32">
        <lukso-button
          v-if="status.isConnected"
          variant="text"
          custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleNavigateSend"
        >
          {{ $formatMessage('header_send') }}
        </lukso-button>
        <lukso-button
          v-if="status.isConnected"
          variant="text"
          custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleNavigateProfile"
        >
          {{ $formatMessage('header_my_profile') }}
        </lukso-button>
        <lukso-button
          v-if="status.isConnected"
          variant="text"
          custom-class="text-purple-51 text-12 hover:text-purple-41 uppercase nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleDisconnect"
        >
          {{ $formatMessage('header_disconnect') }}
        </lukso-button>
        <lukso-button
          v-else
          variant="text"
          custom-class="text-purple-51 text-12 hover:text-purple-41 uppercase nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleConnect"
        >
          {{ $formatMessage('header_connect') }}
        </lukso-button>
      </div>
    </div>
  </lukso-navbar>
</template>
