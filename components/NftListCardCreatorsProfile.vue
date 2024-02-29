<script setup lang="ts">
type Props = {
  profile?: Address
  asset?: Address
  hasName?: boolean
}

const props = defineProps<Props>()

const creatorProfile = useProfile().getProfile(props.profile)
</script>

<template>
  <div class="flex h-6">
    <lukso-profile
      size="x-small"
      :profile-url="getOptimizedImage(creatorProfile?.profileImage, 40)?.src"
      :profile-address="creatorProfile?.address"
      has-identicon
    ></lukso-profile>
    <div class="pl-1" v-if="hasName">
      <div class="paragraph-inter-10-semi-bold text-neutral-60">
        {{ $formatMessage('asset_created_by') }}
      </div>
      <lukso-username
        :name="creatorProfile?.name"
        :address="creatorProfile?.address"
        size="x-small"
        class="flex"
        name-color="neutral-20"
      ></lukso-username>
    </div>
  </div>
</template>
