<script setup lang="ts">
const { isTestnet } = storeToRefs(useAppStore())
</script>

<template>
  <lukso-navbar
    :title="$formatMessage('header_title')"
    :is-testnet="isTestnet ? true : undefined"
    is-transparent
    has-menu
  >
    <div class="flex w-full items-center justify-end gap-4" slot="desktop-menu">
      <lukso-button
        variant="text"
        is-link
        :href="BASE_L14_UP_CLOUD_URL"
        target="_self"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group px-6"
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
      <lukso-button
        variant="landing"
        is-link
        :href="myUpDappBaseUrl()"
        target="_self"
      >
        <span class="nav-apax-12-medium-uppercase">
          {{
            $formatMessage(
              `button_create_${isTestnet ? 'testnet_' : ''}profile`
            )
          }}
        </span>
        <lukso-icon
          name="link-3"
          size="small"
          class="ml-2"
          color="neutral-100"
        ></lukso-icon>
      </lukso-button>
    </div>
    <div slot="mobile-menu">
      <div className="flex flex-col items-center justify-center h-screen pb-32">
        <lukso-button
          variant="text"
          custom-class="no-underline"
          is-link
          :href="BASE_L14_UP_CLOUD_URL"
          target="_self"
        >
          <span
            class="nav-apax-12-medium-uppercase text-purple-51 hover:text-purple-41"
          >
            {{ $formatMessage('button_l14_profiles') }}
          </span>
          <lukso-icon
            name="link-3"
            size="small"
            class="ml-2"
            color="purple-51"
          ></lukso-icon>
        </lukso-button>
        <lukso-button
          variant="text"
          custom-class="no-underline"
          is-link
          :href="myUpDappBaseUrl()"
          target="_self"
        >
          <span
            class="nav-apax-12-medium-uppercase text-purple-51 hover:text-purple-41"
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
            class="ml-2"
            color="purple-51"
          ></lukso-icon>
        </lukso-button>
      </div>
    </div>
  </lukso-navbar>
</template>
