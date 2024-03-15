<script setup lang="ts">
import { useIntersectionObserver, useResizeObserver } from '@vueuse/core'

const showJSON = ref(window.location.search.includes('json'))

type Props = {
  asset: Asset
}

const props = defineProps<Props>()

const { isConnected } = storeToRefs(useAppStore())
const connectedProfile = useProfile().connectedProfile()
const viewedProfileAddress = getCurrentProfileAddress()
const targetIsVisible = ref(false)
const target = ref<HTMLElement | null>(null)
const asset = computed(() => (targetIsVisible.value ? props.asset : null))
const token = useToken()(asset)
const contentRef = ref()
const logoRef = ref()
const symbolRef = ref()
const balanceWidthPx = ref(0)

const calculateBalanceWidth = () => {
  const SPACING = 24 + 32 // gap + padding
  balanceWidthPx.value =
    contentRef.value?.clientWidth -
    logoRef.value?.clientWidth -
    symbolRef.value?.clientWidth -
    SPACING
}

const handleShowAsset = () => {
  try {
    assertAddress(props.asset?.address, 'asset')
    navigateTo(tokenRoute(props.asset.address))
  } catch (error) {
    console.error(error)
  }
}

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile?.value?.address, 'profile')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: props.asset?.address,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  setTimeout(() => {
    useIntersectionObserver(
      target,
      ([{ isIntersecting }], _observerElement) => {
        targetIsVisible.value = targetIsVisible.value || isIntersecting
      }
    )
  }, 1)

  useResizeObserver(contentRef, () => {
    calculateBalanceWidth()
  })
})

watch(
  () => token.value?.isLoading,
  async () => {
    await nextTick()
    calculateBalanceWidth()
  }
)
</script>

<template>
  <div ref="target" class="flex">
    <lukso-card
      border-radius="small"
      shadow="small"
      is-hoverable
      is-full-width
      @click="handleShowAsset"
      ><div
        slot="content"
        class="grid h-full grid-rows-[max-content,auto] p-4"
        ref="contentRef"
      >
        <div
          v-if="showJSON"
          class="w-full overflow-auto whitespace-pre-wrap pt-8"
        >
          token = {{ JSON.stringify(token, null, '  ') }}
        </div>
        <div class="flex h-7 items-start justify-end">
          <AssetStandardBadge
            v-if="asset?.standard"
            :standard="asset.standard"
          />
          <AppPlaceholderLine v-else class="h-[20px] w-1/6" />
        </div>
        <div class="flex gap-6">
          <div ref="logoRef" class="flex flex-col items-center gap-2 pl-2">
            <lukso-profile
              v-if="asset?.address"
              size="medium"
              :profile-address="asset.address"
              :profile-url="
                getAssetThumb(token, true, 260) || ASSET_ICON_PLACEHOLDER_URL
              "
              has-identicon
            ></lukso-profile>
            <AppPlaceholderCircle v-else class="size-14" />
            <div
              v-if="asset?.address"
              class="paragraph-ptmono-10-bold text-neutral-60"
            >
              #{{ asset?.address.slice(2, 8) }}
            </div>
            <AppPlaceholderLine v-else class="h-[14px] w-full" />
          </div>
          <div
            class="grid w-full grid-rows-[max-content,max-content,auto] gap-1"
          >
            <div class="heading-inter-14-bold">
              <div v-if="asset?.tokenName">{{ asset.tokenName }}</div>
              <AppPlaceholderLine v-else class="h-[17px] w-1/3" />
            </div>
            <div
              v-if="asset"
              class="heading-inter-21-semi-bold flex items-center"
            >
              <span
                v-if="asset?.balance"
                class="truncate"
                :style="{
                  'max-width': `${balanceWidthPx}px`,
                }"
                :title="
                  $formatNumber(
                    fromWeiWithDecimals(asset.balance, asset.decimals)
                  )
                "
                >{{
                  $formatNumber(
                    fromWeiWithDecimals(asset.balance, asset.decimals)
                  )
                }}</span
              >
              <span v-else>0</span>
              <span
                ref="symbolRef"
                class="paragraph-inter-14-semi-bold pl-2 text-neutral-60"
                >{{ asset?.tokenSymbol }}</span
              >
            </div>
            <div v-else class="grid grid-cols-[2fr,1fr] items-center gap-2">
              <AppPlaceholderLine class="h-[26px] w-full" />
              <AppPlaceholderLine class="h-[22px] w-full" />
            </div>
            <div
              v-if="asset?.balance && asset.tokenSymbol"
              class="paragraph-inter-12-regular"
            >
              {{ $formatCurrency(asset.balance, asset.tokenSymbol) }}
            </div>
            <div class="flex w-full items-end justify-end">
              <lukso-button
                v-if="
                  isConnected &&
                  viewedProfileAddress === connectedProfile?.address
                "
                size="small"
                variant="secondary"
                @click="handleSendAsset"
                class="mt-4 transition-opacity hover:opacity-70"
                >{{ $formatMessage('button_send') }}</lukso-button
              >
            </div>
          </div>
        </div>
      </div>
    </lukso-card>
  </div>
</template>
