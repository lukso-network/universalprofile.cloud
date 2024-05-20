<script setup lang="ts">
definePageMeta({
  layout: 'landing',
})

const { currentNetwork } = storeToRefs(useAppStore())
const { search } = useAlgoliaSearch<IndexedProfile>(
  currentNetwork.value.profileIndexName
)
const { isTestnet } = storeToRefs(useAppStore())

const numberOfProfiles = ref<number>()

const getNumberOfProfiles = async () => {
  const profiles = await search({
    query: '',
    requestOptions: {
      hitsPerPage: 0,
      attributesToRetrieve: undefined,
    },
  })
  numberOfProfiles.value = profiles.nbHits
}

onMounted(async () => {
  await getNumberOfProfiles()
})
</script>

<template>
  <AppPageLoader>
    <div
      class="mx-auto flex max-w-[1200px] flex-col items-center px-6 transition-opacity duration-300 lg:px-4"
    >
      <AppTestnetWarning v-if="isTestnet" class="-mb-6" />
      <h1 class="flex flex-col justify-center pt-16 text-center">
        <div class="heading-apax-48-regular">
          {{ $formatMessage('hero_title_01') }}
        </div>
        <div class="heading-apax-48-bold">
          {{ $formatMessage('hero_title_02') }}
        </div>
      </h1>
      <div
        class="mb-20 mt-8 flex w-full flex-col items-center justify-center sm:mb-28 sm:w-1/2 lg:w-2/5"
      >
        <AppNavbarProfileSearch class="w-full" />
        <div
          class="paragraph-inter-14-regular mt-6 text-center text-neutral-40"
        >
          <lukso-sanitize
            :html-content="
              $formatMessage('erc725account_info_part1', {
                numberOfProfiles: `<strong>${numberOfProfiles?.toLocaleString()}</strong>`,
                luksoWebsiteLink: `<strong>on <a
          class='underline hover:text-neutral-20'
          href='https://lukso.network/'
          target='_blank'
          >LUKSO</a></strong>`,
              })
            "
          ></lukso-sanitize>
          <br />
          <lukso-sanitize
            :html-content="
              $formatMessage('erc725account_info_part2', {
                erc725accountLink: `<a
          class='underline hover:text-neutral-20'
          href='https://docs.lukso.tech/standards/introduction/'
          target='_blank'
          >ERC725Account</a
        >`,
                createUPlink: `<a
          class='underline hover:text-neutral-20'
          href='https://my.universalprofile.cloud'
          target='_blank'
          >${$formatMessage('erc725account_info_part3')}</a
        >`,
              })
            "
          ></lukso-sanitize>
        </div>
      </div>
      <CreateProfileBox />
      <div
        class="relative grid w-full grid-cols-1 gap-12 pb-20 md:pb-0"
        :class="{ 'md:grid-cols-1': isTestnet, 'md:grid-cols-2': !isTestnet }"
      >
        <ProfileShowcase />
        <ActivityList v-if="!isTestnet" />
      </div>
      <DappShowcase />
      <AssetShowcase />
    </div>
  </AppPageLoader>
</template>
