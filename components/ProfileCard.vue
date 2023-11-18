<script setup lang="ts">
const { viewedProfile } = useViewedProfile()
</script>

<template>
  <div class="relative">
    <lukso-card
      variant="hero"
      :background-url="viewedProfile?.backgroundImage?.base64"
      is-full-width
      custom-class="rounded-24 shadow-neutral-drop-shadow"
      class="mb-22"
    >
      <div slot="content" class="flex flex-col items-center">
        <div class="relative bottom-[-140px] text-center">
          <div class="group flex cursor-pointer flex-col items-center">
            <lukso-tooltip
              variant="light"
              offset="15"
              is-clipboard-copy
              :copy-text="$formatMessage('profile_card_copy_address')"
              :copy-value="viewedProfile?.address"
            >
              <lukso-profile
                :profile-url="viewedProfile?.profileImage?.base64"
                :profile-address="viewedProfile?.address"
                size="x-large"
                has-identicon
                class="relative z-[1] inline-flex rounded-full outline outline-4 outline-neutral-100 transition group-hover:scale-105"
              >
              </lukso-profile>
              <div
                class="paragraph-ptmono-16-regular relative -top-10 h-0 text-24 opacity-10 transition group-hover:opacity-30"
              >
                {{ viewedProfile?.address }}
              </div>
            </lukso-tooltip>
          </div>
          <lukso-username
            v-if="viewedProfile?.name"
            :name="viewedProfile?.name.toLowerCase()"
            :address="viewedProfile?.address"
            address-color="neutral-80"
            size="large"
            max-width="350"
            class="mt-4"
          ></lukso-username>
          <lukso-username
            v-else
            :name="$formatMessage('profile_default_name')"
            :address="viewedProfile?.address"
            address-color="neutral-80"
            size="large"
            max-width="350"
            class="mt-4"
            hide-prefix
          ></lukso-username>
        </div>
      </div>
    </lukso-card>
  </div>
</template>
