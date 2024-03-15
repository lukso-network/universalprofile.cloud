<script setup lang="ts">
import makeBlockie from 'ethereum-blockies-base64'
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const showJSON = ref(window.location.search.includes('json'))

type Props = {
  asset: Asset
  hasAddress?: boolean
}

const props = defineProps<Props>()

const { isConnected } = storeToRefs(useAppStore())
const connectedProfile = useProfile().connectedProfile()
const targetIsVisible = ref(false)

const target = ref<HTMLElement | null>(null)
useIntersectionObserver(target, ([{ isIntersecting }], _observerElement) => {
  targetIsVisible.value = targetIsVisible.value || isIntersecting
})

const asset = computed(() => (targetIsVisible.value ? props.asset : null))
const token = useToken()(asset)
const viewedProfileAddress = getCurrentProfileAddress()

const handleShowAsset = () => {
  try {
    assertAddress(props.asset?.address)

    if (isCollectible(props.asset)) {
      navigateTo(nftRoute(props.asset.address, props.asset?.tokenId || '0x'))
    } else {
      navigateTo(tokenRoute(props.asset.address))
    }
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
        tokenId: props.asset?.tokenId,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

const assetTokenId = computed(() => {
  return prefixedTokenId(props.asset?.tokenId, props.asset?.tokenIdFormat, 24)
})
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
        class="grid h-full grid-rows-[auto,max-content] rounded-12 bg-neutral-97"
      >
        <div
          v-if="showJSON"
          class="w-full overflow-auto whitespace-pre-wrap pt-8"
        >
          token = {{ JSON.stringify(token, null, '  ') }}
        </div>
        <div
          class="grid grid-rows-[max-content,auto] rounded-12 bg-neutral-100 shadow-neutral-drop-shadow"
        >
          <AssetImage
            :src="getAssetThumb(token, false, 260)"
            class="min-h-[260px] rounded-t-12 md:max-h-[260px]"
          />
          <div
            class="relative grid grid-rows-[max-content,max-content,auto] p-4"
          >
            <div
              class="relative top-[-40px] flex cursor-pointer flex-col gap-1 rounded-4 bg-neutral-100 p-2 pr-6 shadow-neutral-drop-shadow"
            >
              <div class="paragraph-inter-14-semi-bold flex items-center gap-1">
                <span v-if="token?.tokenName">{{ token.tokenName }}</span>
                <span
                  v-else
                  class="h-[22px] w-1/2 rounded-4 bg-neutral-90"
                ></span>
                <span
                  v-if="token?.tokenSymbol"
                  class="paragraph-inter-10-semi-bold text-neutral-60"
                  >{{ token.tokenSymbol }}</span
                >
                <span
                  v-else
                  class="h-[12px] w-1/4 rounded-[2px] bg-neutral-90"
                ></span>
              </div>
              <div class="paragraph-ptmono-10-bold">
                <span v-if="isLsp8(token) && asset?.tokenId">
                  {{ assetTokenId }}
                </span>
                <span v-else-if="token?.balance">
                  {{ $formatMessage('token_owned') }}
                  {{ token.balance }}
                </span>
                <div
                  v-else
                  class="h-[12px] w-1/4 rounded-[2px] bg-neutral-90"
                ></div>
              </div>
            </div>
            <NftListCardCreators
              v-if="token"
              :asset="token"
              class="relative -top-4 -mt-2"
            />
            <div
              v-else
              class="relative -top-4 -mt-2 grid grid-cols-[max-content,auto] gap-1"
            >
              <div class="size-6 rounded-full bg-neutral-90"></div>
              <div class="grid w-full flex-col gap-1">
                <div class="w-1/3 rounded-[2px] bg-neutral-90"></div>
                <div class="w-1/2 rounded-[2px] bg-neutral-90"></div>
              </div>
            </div>
            <div class="flex items-end">
              <div class="flex w-full justify-end">
                <lukso-button
                  v-if="
                    isConnected &&
                    viewedProfileAddress === connectedProfile?.address
                  "
                  size="small"
                  variant="secondary"
                  @click="handleSendAsset"
                  class="transition-opacity hover:opacity-70"
                  >{{ $formatMessage('button_send') }}</lukso-button
                >
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between px-4 py-3">
          <AssetStandardBadge
            v-if="token?.standard"
            :standard="token.standard"
          />
          <div v-else class="h-[20px] w-1/6 rounded-4 bg-neutral-90"></div>
          <div
            v-if="token?.address"
            class="paragraph-ptmono-10-bold flex items-center gap-1 text-neutral-60"
          >
            <img
              :src="makeBlockie(token.address)"
              alt=""
              class="size-3 rounded-full shadow-neutral-above-shadow-1xl outline outline-neutral-100"
            />
            {{ token?.address?.slice(0, 6) }}
          </div>
          <div v-else class="h-[20px] w-1/6 rounded-4 bg-neutral-90"></div>
        </div>
      </div>
    </lukso-card>
  </div>
</template>
