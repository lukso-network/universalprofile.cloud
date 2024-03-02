<script setup lang="ts">
type Props = {
  asset: Asset
}

export type VerifyStatus = 'verified' | 'unverified' | 'partial'

const props = defineProps<Props>()
const creators = computed(() => {
  let items = (props.asset?.tokenCreators || []) as Address[]
  if (items.length === 0 && props.asset?.owner) {
    items = [props.asset?.owner as Address]
  }
  return items
})
const issued = useIssuedAssets().validateAssets(
  creators.value,
  props.asset?.address
)
const verifyInfo = computed(() => issued.value)

const verifyStatus = computed<VerifyStatus>(() => {
  const hasSome = verifyInfo.value.some(info => info)
  if (!hasSome) {
    return 'unverified'
  }

  if (verifyInfo.value.every(info => info)) {
    return 'verified'
  }

  return 'partial'
})
</script>

<template>
  <!--no creators at all including owner, might be that its EOA or not indexed -->
  <div v-if="(creators || []).length === 0"></div>
  <div v-else class="grid animate-fade-in grid-cols-[max-content,auto]">
    <div class="flex space-x-[-14px]">
      <NftListCardCreatorsProfile
        v-for="(creatorAddress, index) in (creators || []).slice(1)"
        :profile="creatorAddress"
        :asset="asset.address"
        :key="index"
        class="relative"
      />
      <NftListCardCreatorsProfile
        v-if="creators[0]"
        :profile="creators[0]"
        :asset="asset.address"
        class="relative"
        has-name
      />
    </div>
    <div class="flex items-center justify-end">
      <lukso-tooltip
        v-if="verifyStatus === 'unverified'"
        variant="danger"
        :text="$formatMessage('asset_all_creators_unverified')"
        class="ml-2"
      >
        <lukso-icon
          name="cross-filled"
          color="red-55"
          secondary-color="neutral-100"
          size="small"
        ></lukso-icon>
      </lukso-tooltip>
      <lukso-tooltip
        v-if="verifyStatus === 'partial'"
        variant="danger"
        :text="$formatMessage('asset_all_creators_partial')"
        class="ml-2"
      >
        <lukso-icon
          name="cross-filled"
          color="red-55"
          secondary-color="neutral-100"
          size="small"
        ></lukso-icon>
      </lukso-tooltip>
      <lukso-tooltip
        v-if="verifyStatus === 'verified'"
        variant="success"
        :text="$formatMessage('asset_all_creators_verified')"
        class="ml-2"
      >
        <lukso-icon
          name="complete-filled"
          color="green-54"
          secondary-color="neutral-100"
          size="small"
        ></lukso-icon>
      </lukso-tooltip>
    </div>
  </div>
</template>
