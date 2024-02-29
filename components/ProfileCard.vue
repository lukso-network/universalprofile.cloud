<script setup lang="ts">
const profile = useProfile().viewedProfile()
</script>

<template>
  <div class="relative">
    <lukso-card
      variant="hero"
      :background-url="getOptimizedImage(profile?.backgroundImage, 880)"
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
              :copy-value="profile?.address"
            >
              <lukso-profile
                :profile-url="getOptimizedImage(profile?.profileImage, 96)"
                :profile-address="profile?.address"
                size="x-large"
                has-identicon
                class="relative z-[1] inline-flex rounded-full outline outline-4 outline-neutral-100 transition group-hover:scale-105"
              >
              </lukso-profile>
              <div
                class="paragraph-ptmono-16-regular relative -top-10 h-0 text-14 opacity-10 transition group-hover:opacity-30 md:text-24"
              >
                {{ profile?.address }}
              </div>
            </lukso-tooltip>
          </div>
          <lukso-username
            v-if="profile?.name"
            :name="profile?.name.toLowerCase()"
            :address="profile?.address"
            address-color="neutral-80"
            size="large"
            max-width="350"
            class="mt-4"
          ></lukso-username>
          <lukso-username
            v-else
            :name="$formatMessage('profile_default_name')"
            :address="profile?.address"
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
