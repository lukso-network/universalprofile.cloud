<script setup lang="ts">
const { status } = useConnectionStore()
const { connect } = useBrowserExtension()

const handleConnect = async () => {
  connect()
}

const extensionStoreData = () => {
  const url = browserInfo().storeLink
  const icon = `logo-${browserInfo().id}`

  return {
    icon,
    url,
  }
}

const extensionStore = extensionStoreData()
const hasExtension = extensionStore.url !== ''
</script>

<template>
  <lukso-button
    v-if="status.isConnected"
    @click="handleConnect"
    variant="landing"
    custom-class="mt-6"
    is-full-width
  >
    {{ $formatMessage('connect_or_install_button_connect') }}
  </lukso-button>
  <lukso-button
    v-else
    variant="landing"
    custom-class="mt-6"
    is-full-width
    :is-link="hasExtension ? 'true' : undefined"
    :href="extensionStore.url"
    :disabled="!hasExtension ? 'true' : undefined"
  >
    <lukso-icon
      :name="extensionStore.icon"
      color="neutral-100"
      secondary-color="purple-51"
      class="mr-2"
    />
    <span v-if="hasExtension">
      {{ $formatMessage('connect_or_install_button_install') }}
    </span>
    <span v-else>
      {{ $formatMessage('connect_or_install_button_coming_soon') }}
    </span>
  </lukso-button>
</template>
