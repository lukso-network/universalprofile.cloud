<script setup lang="ts">
import { routes } from '@/shared/routes'

const router = useRouter()
const profileAddress = router.currentRoute.value.params?.address

const handleNavigateProfile = () => {
  navigateTo(`/${profileAddress}${routes.profile}`)
}

const handleNavigateSend = () => {
  navigateTo(`/${profileAddress}${routes.send}`)
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
        variant="text"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        @click="handleNavigateSend"
      >
        {{ $formatMessage('header_send') }}
      </lukso-button>
      <lukso-button
        variant="text"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        @click="handleNavigateProfile"
      >
        {{ $formatMessage('header_my_profile') }}
      </lukso-button>
      <lukso-button
        variant="secondary"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
      >
        {{ $formatMessage('header_connect') }}
      </lukso-button>
    </div>
    <div slot="mobile">
      <div className="flex flex-col items-center justify-center h-screen pb-32">
        <lukso-button
          variant="text"
          custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleNavigateSend"
        >
          {{ $formatMessage('header_send') }}
        </lukso-button>
        <lukso-button
          variant="text"
          custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleNavigateProfile"
        >
          {{ $formatMessage('header_my_profile') }}
        </lukso-button>
        <!-- <lukso-button
          v-if="appStore.isConnected"
          variant="text"
          custom-class="text-purple-51 text-12 hover:text-purple-41 uppercase nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleDisconnect"
        >
          {{ $formatMessage('header_disconnect') }}
        </lukso-button> -->
        <lukso-button
          variant="text"
          custom-class="text-purple-51 text-12 hover:text-purple-41 uppercase nav-apax-12-medium-uppercase font-apax font-500"
        >
          {{ $formatMessage('header_connect') }}
        </lukso-button>
      </div>
    </div>
  </lukso-navbar>
</template>
