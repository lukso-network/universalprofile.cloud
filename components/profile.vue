<script setup lang="ts">
const { address, name, backgroundUrl, profileUrl } = useProfileStore()
</script>

<template>
  <div>
    <lukso-card
      variant="profile"
      :background-url="backgroundUrl"
      :profile-url="profileUrl"
      :profile-address="address"
      is-full-width
    >
      <div slot="content" class="px-6 pb-6 flex flex-col items-center">
        <lukso-username v-if="name" :name="name" size="large"></lukso-username>
        <lukso-username
          :address="address"
          :size="name ? 'small' : 'large'"
          slice-by="40"
        ></lukso-username>
      </div>
    </lukso-card>
  </div>
</template>
