<script setup lang="ts">
const { currentNetwork } = storeToRefs(useAppStore())
const { search } = useAlgoliaSearch<IndexedProfile>(
  currentNetwork.value.indexName
)
const { cacheValue } = useCache()
const numberOfProfiles = ref<number>()

const getNumberOfProfiles = async () => {
  const profiles = await search({
    query: '',
    requestOptions: {
      hitsPerPage: 0,
      attributesToRetrieve: undefined,
    },
  })

  return profiles.nbHits
}

onMounted(async () => {
  numberOfProfiles.value =
    (await cacheValue<number>(getNumberOfProfiles, {
      key: 'profile-number',
      expiryAfter: PROFILE_NUMBER_CACHE_EXPIRY,
    })) || 0
})
</script>

<template>
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
</template>
