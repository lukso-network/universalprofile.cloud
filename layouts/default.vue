<script setup lang="ts">
const {
  setStatus,
  profile: viewedProfile,
  setProfile,
} = useViewedProfileStore()

const setupViewedProfile = async () => {
  try {
    const profileAddress = useRouter().currentRoute.value.params?.profileAddress

    setStatus('isProfileLoading', true)
    assertAddress(profileAddress, 'wallet')
    viewedProfile.address = profileAddress
    const profile = await fetchProfile(profileAddress)
    setProfile(profile)
  } catch (error) {
    console.error(error)
    navigateTo(notFoundRoute())
  } finally {
    setStatus('isProfileLoading', false)
  }
}

const setupViewedAssets = async () => {
  try {
    const { profile, setOwnedAssets, setStatus, setCreatedAssets } =
      useViewedProfileStore()
    const { fetchAssets } = useErc725()

    setStatus('isAssetLoading', true)
    assertNotUndefined(profile.address)

    setOwnedAssets(await fetchAssets(profile.address, 'LSP5ReceivedAssets[]'))
    setCreatedAssets(await fetchAssets(profile.address, 'LSP12IssuedAssets[]'))
  } catch (error) {
    console.error(error)
  } finally {
    setStatus('isAssetLoading', false)
  }
}

onMounted(async () => {
  await setupViewedProfile()
  await setupViewedAssets()
})
</script>

<template>
  <div class="min-h-screen grid grid-rows-[max-content,auto,max-content]">
    <Navbar />
    <slot />
    <Footer />
  </div>
</template>
