<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { disconnect } = useBaseProvider()

const DROPDOWN_TRIGGER_TAG_NAME = 'LUKSO-PROFILE'
const isDropdownOpen = ref(false)

const handleToggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const avatarImage = useProfileAvatar(connectedProfile, 40)

const handleDisconnect = async () => {
  disconnect()
}

const handleOutsideDropdown = (event: Event) => {
  const element = event.target as HTMLElement

  if (element.tagName === DROPDOWN_TRIGGER_TAG_NAME) {
    return
  }

  isDropdownOpen.value = false
}

const handleNavigateMyUpDashboard = () => {
  window.open(myUpDappDashboardUrl(), '_self')
}

const handleNavigateSettings = () => {
  navigateTo(settingsRoute())
}

const handleNavigateProfile = async () => {
  navigateTo(profileRoute(connectedProfile.value?.address))
}

onMounted(() => {
  window.addEventListener('click', handleOutsideDropdown)
})

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideDropdown)
})
</script>

<template>
  <div class="relative cursor-pointer pl-4">
    <lukso-profile
      size="small"
      :profile-url="avatarImage?.url"
      @click="handleToggleDropdown"
      :profile-address="connectedProfile?.address"
      :data-profile-address="connectedProfile?.address"
      has-identicon
    ></lukso-profile>
    <div
      class="absolute right-0 z-[1000] mt-8 animate-fade-in select-none rounded-12 bg-neutral-100 shadow-pink-drop-shadow animation-duration-150 before:absolute before:right-0 before:top-0 before:-mt-1 before:mr-4 before:size-3 before:rotate-45 before:bg-neutral-100"
      :class="isDropdownOpen ? 'block' : 'hidden'"
    >
      <lukso-button
        v-if="activePage('index')"
        variant="text"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group"
        @click="handleNavigateProfile"
      >
        <span class="text-purple-63 transition group-hover:text-purple-41">
          {{ $formatMessage('header_my_profile') }}
        </span>
      </lukso-button>
      <lukso-button
        variant="text"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group"
        @click="handleNavigateMyUpDashboard"
      >
        <span class="text-purple-63 transition group-hover:text-purple-41">
          {{ $formatMessage('header_relayer_dashboard') }}
        </span>
      </lukso-button>
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
      <lukso-button
        variant="text"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group"
        @click="handleDisconnect"
      >
        <span class="text-purple-63 transition group-hover:text-purple-41">
          {{ $formatMessage('header_disconnect') }}
        </span>
      </lukso-button>
    </div>
  </div>
</template>
