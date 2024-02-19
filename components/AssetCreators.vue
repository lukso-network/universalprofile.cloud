<script setup lang="ts">
type Props = {
  asset: Asset
}

const props = defineProps<Props>()
const { isMobile } = useDevice()

const { creators, isPending, isVerified } = useCreators(props.asset)

const handleOpenProfile = (address?: Address) => {
  if (address) {
    navigateTo(profileRoute(address))
    fetchAndStoreAssets(address)
  }
}
</script>

<template>
  <div v-if="isPending" class="animate-pulse">
    <div class="mb-2 h-4 w-20 rounded-4 bg-neutral-90"></div>
    <div class="mb-8 h-12 w-52 rounded-12 bg-neutral-90"></div>
  </div>
  <div v-else-if="!creators.length"></div>
  <div v-else class="animate-fade-in">
    <div class="heading-inter-14-bold pb-2">
      {{ $formatMessage('asset_creators_title') }}
    </div>
    <div class="mb-8 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
      <lukso-button
        v-for="(creatorProfile, index) in creators"
        :key="index"
        custom-class="px-4"
        variant="secondary"
        :is-full-width="isMobile ? true : undefined"
        @click="handleOpenProfile(creatorProfile?.address)"
      >
        <div class="flex w-full items-center justify-between">
          <div class="flex items-center">
            <lukso-profile
              size="x-small"
              :profile-url="creatorProfile?.profileImage?.url"
              :profile-address="creatorProfile?.address"
              has-identicon
            ></lukso-profile>
            <lukso-username
              :name="creatorProfile?.name"
              :address="creatorProfile?.address"
              size="small"
              class="pl-2"
              name-color="neutral-20"
            ></lukso-username>
          </div>
          <div class="flex items-center">
            <lukso-tooltip
              v-if="isVerified(creatorProfile)"
              variant="success"
              :text="$formatMessage('asset_creators_verified')"
              class="ml-2"
            >
              <lukso-icon
                name="complete-filled"
                color="green-54"
                secondary-color="neutral-100"
                size="small"
              ></lukso-icon>
            </lukso-tooltip>
            <lukso-tooltip
              v-else
              variant="danger"
              :text="$formatMessage('asset_creators_unverified')"
              class="ml-2"
            >
              <lukso-icon
                name="cross-filled"
                color="red-55"
                secondary-color="neutral-100"
                size="small"
              ></lukso-icon>
            </lukso-tooltip>
          </div>
        </div>
      </lukso-button>
    </div>
  </div>
</template>
