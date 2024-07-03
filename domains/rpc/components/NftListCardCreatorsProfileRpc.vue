<script setup lang="ts">
type Props = {
  profileAddress?: Address
  hasName?: boolean
  count?: number
  isSmall?: boolean
}

const props = defineProps<Props>()
const address = computed(() => props.profileAddress)
const creatorProfile = useProfile().getProfile(address)
const profileAvatar = useProfileAvatar(creatorProfile, 24)
</script>

<template>
  <div
    class="flex"
    :class="{
      'h-6': isSmall,
      'h-10': !isSmall,
    }"
  >
    <div
      v-if="count"
      class="flex items-center justify-center rounded-full bg-neutral-100 outline outline-2 outline-neutral-90"
      :class="{
        'paragraph-inter-10-semi-bold size-6': isSmall,
        'paragraph-inter-14-semi-bold size-10': !isSmall,
      }"
    >
      +{{ count }}
    </div>
    <lukso-profile
      v-else
      :size="isSmall ? 'x-small' : 'small'"
      :profile-url="profileAvatar?.url"
      :profile-address="creatorProfile?.address"
      has-identicon
    ></lukso-profile>
    <div
      class="flex flex-col justify-center"
      :class="{
        'pl-1': isSmall,
        'gap-1 pl-2': !isSmall,
      }"
      v-if="hasName"
    >
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
