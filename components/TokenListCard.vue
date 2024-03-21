<script setup lang="ts">
import {
  useIntersectionObserver,
  useResizeObserver,
  useElementSize,
} from '@vueuse/core'

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

const assetImage = useAssetImage(token, true, 260)

const calculateBalanceWidth = () => {
  const SPACING = 24 + 32 // gap + padding
  const { width: contentWidth } = useElementSize(contentRef.value)
  const { width: logoWidth } = useElementSize(logoRef.value)
  const { width: symbolWidth } = useElementSize(symbolRef.value)

  balanceWidthPx.value =
    contentWidth.value - logoWidth.value - symbolWidth.value - SPACING
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

const isLoaded = computed(() => token.value && !token.value.isLoading)
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
        <div class="flex h-7 items-start justify-end">
          <AssetStandardBadge :asset="token" />
        </div>
        <div class="flex gap-6">
          <div ref="logoRef" class="flex flex-col items-center gap-2 pl-2">
            <lukso-profile
              v-if="isLoaded"
              size="medium"
              :profile-address="token?.address"
              :profile-url="assetImage"
              has-identicon
            ></lukso-profile>
            <AppPlaceholderCircle v-else class="size-14" />
            <div
              v-if="isLoaded"
              class="paragraph-ptmono-10-bold text-neutral-60"
            >
              #{{ token?.address?.slice(2, 8) }}
            </div>
            <AppPlaceholderLine v-else class="h-[14px] w-full" />
          </div>
          <div
            class="grid w-full grid-rows-[max-content,max-content,auto] gap-1"
          >
            <div class="heading-inter-14-bold">
              <div v-if="isLoaded">{{ token?.tokenName }}</div>
              <AppPlaceholderLine v-else class="h-[17px] w-1/3" />
            </div>
            <div
              v-if="isLoaded"
              class="heading-inter-21-semi-bold flex items-center"
            >
              <span
                v-if="token?.balance"
                class="truncate"
                :style="{
                  'max-width': `${balanceWidthPx}px`,
                }"
                :title="
                  $formatNumber(
                    fromWeiWithDecimals(token.balance, token.decimals)
                  )
                "
                >{{
                  $formatNumber(
                    fromWeiWithDecimals(token.balance, token.decimals)
                  )
                }}</span
              >
              <span v-else>0</span>
              <span
                ref="symbolRef"
                class="paragraph-inter-14-semi-bold pl-2 text-neutral-60"
                >{{ token?.tokenSymbol }}</span
              >
            </div>
            <div v-else class="grid grid-cols-[2fr,1fr] items-center gap-2">
              <AppPlaceholderLine class="h-[26px] w-full" />
              <AppPlaceholderLine class="h-[22px] w-full" />
            </div>
            <div
              v-if="token?.balance && token.tokenSymbol"
              class="paragraph-inter-12-regular"
            >
              {{ $formatCurrency(token.balance, token.tokenSymbol) }}
            </div>
            <div class="flex w-full items-end justify-end">
              <div v-if="isLoaded">
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
              <AppPlaceholderLine v-else class="h-[28px] w-[60px]" />
            </div>
          </div>
        </div>
      </div>
    </lukso-card>
  </div>
</template>
