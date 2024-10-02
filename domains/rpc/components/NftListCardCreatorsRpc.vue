<script setup lang="ts">
type Props = {
  asset?: Asset
  isSmall?: boolean
  hasVerification?: boolean
}

export type VerifyStatus = 'verified' | 'unverified' | 'partial'

const CREATOR_SHOW_LIMIT = 4
const props = withDefaults(defineProps<Props>(), {
  asset: undefined,
  isSmall: true,
  hasVerification: true,
})

const asset = computed(() => props.asset)
const assetAddress = computed(() => asset.value?.address)
const creators = computed(() => {
  let items = (props.asset?.tokenCreators || []) as Address[]
  if (items.length === 0 && props.asset?.owner) {
    items = [asset.value?.owner as Address]
  }
  return items
})

const creatorsWithLimit = computed(() => {
  if (tooManyCreators.value) {
    return creators.value.slice(0, CREATOR_SHOW_LIMIT)
  }
  return creators.value.slice(1)
})

const issued = useIssuedAssetsRpc().validateAssets(creators, assetAddress)

const verifyStatus = computed<VerifyStatus>(() => {
  const array = Array.from(issued.value?.values() || [])
  const hasSome = array?.some(info => info)
  if (!hasSome) {
    return 'unverified'
  }

  if (array.every(Boolean)) {
    return 'verified'
  }

  return 'partial'
})

const tooManyCreators = computed(
  () => creators.value.length > CREATOR_SHOW_LIMIT
)

const isLoaded = computed(() => asset.value && !asset.value.isLoading)
</script>

<template>
  <div v-if="isLoaded">
    <!--no creators at all including owner, might be that its EOA or not indexed -->
    <div
      v-if="creators.length === 0"
      class="grid grid-cols-[max-content,auto] gap-1"
    ></div>
    <div v-else class="grid animate-fade-in grid-cols-[max-content,auto]">
      <div
        class="flex"
        :class="{ 'space-x-[-14px]': isSmall, 'space-x-[-26px]': !isSmall }"
      >
        <NftListCardCreatorsProfileRpc
          v-for="(creatorAddress, index) in creatorsWithLimit || []"
          :profile-address="creatorAddress"
          :key="index"
          :is-small="isSmall"
          class="relative"
        />
        <NftListCardCreatorsProfileRpc
          v-if="creators[0]"
          :profile-address="creators[0]"
          :count="tooManyCreators ? creators.length - CREATOR_SHOW_LIMIT : 0"
          :is-small="isSmall"
          class="relative"
          has-name
        />
      </div>
      <div v-if="hasVerification" class="flex items-center justify-end">
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
  </div>
  <div v-else class="grid grid-cols-[max-content,auto] items-center gap-1">
    <AppPlaceholderCircle :class="{ 'size-6': isSmall, 'size-10': !isSmall }" />
    <div
      class="grid h-[24px] w-full flex-col items-center gap-1"
      :class="{
        'pl-1': isSmall,
        'pl-2': !isSmall,
      }"
    >
      <AppPlaceholderLine
        :class="{ 'h-2 w-[40px]': isSmall, 'h-3 w-[60px]': !isSmall }"
      />
      <AppPlaceholderLine
        :class="{ 'h-2 w-[80px]': isSmall, 'h-3 w-[120px]': !isSmall }"
      />
    </div>
  </div>
</template>
