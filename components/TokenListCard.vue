<script setup lang="ts">
import { Asset, StandardsAbbreviations } from '@/types/assets'

type Props = {
  asset: Asset
  hasAddress?: boolean
}

const props = defineProps<Props>()

const { isConnected } = useAppStore()
const { connectedProfile } = useConnectedProfile()
const { viewedProfile } = useViewedProfile()
const contentRef = ref()
const logoRef = ref()
const symbolRef = ref()
const balanceWidthPx = ref(0)

const handleShowAsset = () => {
  try {
    assertAddress(viewedProfile.value?.address, 'profile')
    assertAddress(props.asset.address, 'asset')
    navigateTo(tokenRoute(viewedProfile.value.address, props.asset.address))
  } catch (error) {
    console.error(error)
  }
}

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.value?.address, 'profile')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: props.asset.address,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  const resizeObserver = new ResizeObserver(() => {
    const GAP = 24

    balanceWidthPx.value =
      contentRef.value?.clientWidth -
      logoRef.value?.clientWidth -
      symbolRef.value?.clientWidth -
      GAP
  })
  resizeObserver.observe(contentRef.value)
})
</script>

<template>
  <lukso-card size="small" is-hoverable is-full-width @click="handleShowAsset"
    ><div slot="content" class="p-4 h-full grid grid-rows-[max-content,auto]">
      <div class="h-7 flex justify-end items-start">
        <lukso-tag
          v-if="asset.standard"
          size="x-small"
          background-color="lukso-90"
          >{{ StandardsAbbreviations[asset.standard] }}</lukso-tag
        >
      </div>
      <div ref="contentRef" class="flex gap-6">
        <div ref="logoRef" class="pl-2 flex flex-col items-center">
          <lukso-profile
            size="medium"
            :profile-address="asset.address"
            :profile-url="asset.icon"
            :has-identicon="hasAddress ? 'true' : undefined"
          ></lukso-profile>
          <div
            v-if="hasAddress"
            class="paragraph-ptmono-10-bold text-neutral-60 pt-2"
          >
            #{{ asset.address?.slice(2, 8) }}
          </div>
        </div>
        <div class="grid w-full grid-rows-[max-content,max-content,auto]">
          <div class="heading-inter-14-bold pb-1">{{ asset.name }}</div>
          <div class="heading-inter-21-semi-bold flex items-center pb-1">
            <span
              v-if="asset.amount"
              class="truncate"
              :style="{
                'max-width': `${balanceWidthPx}px`,
              }"
              :title="
                $formatNumber(fromWeiWithDecimals(asset.amount, asset.decimals))
              "
              >{{
                $formatNumber(fromWeiWithDecimals(asset.amount, asset.decimals))
              }}</span
            >
            <span v-else>0</span>
            <span
              ref="symbolRef"
              class="paragraph-inter-14-semi-bold text-neutral-60 pl-2"
              >{{ asset.symbol }}</span
            >
          </div>
          <div
            v-if="asset.amount && asset.symbol"
            class="paragraph-inter-12-regular"
          >
            {{ $formatCurrency(asset.amount, asset.symbol) }}
          </div>
          <div class="flex justify-end w-full items-end">
            <lukso-button
              v-if="
                isConnected &&
                viewedProfile?.address === connectedProfile?.address
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
</template>
