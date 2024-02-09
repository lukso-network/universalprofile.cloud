<script setup lang="ts">
import makeBlockie from 'ethereum-blockies-base64'

import { type Asset } from '@/models/asset'
import { CreatorRepository } from '@/repositories/creator'

type Props = {
  asset: Asset
  hasAddress?: boolean
}

const props = defineProps<Props>()

const { isConnected } = storeToRefs(useAppStore())
const { connectedProfile } = useConnectedProfile()
const { viewedProfile } = useViewedProfile()
const creatorsRepository = useRepo(CreatorRepository)

const creators = computed(() => {
  return creatorsRepository.getAssetCreators(
    props.asset?.address,
    props.asset?.tokenId
  )
})

const handleShowAsset = () => {
  try {
    assertAddress(props.asset?.address)
    assertString(props.asset.tokenId)

    if (isCollectible(props.asset)) {
      navigateTo(nftRoute(props.asset.address, props.asset.tokenId))
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
    assertAddress(connectedProfile.value?.address, 'profile')
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
  <lukso-card
    size="small"
    shadow="small"
    is-hoverable
    is-full-width
    @click="handleShowAsset"
    ><div
      slot="content"
      class="grid h-full grid-rows-[auto,max-content] rounded-12 bg-neutral-97"
    >
      <div
        class="grid grid-rows-[max-content,auto] rounded-12 bg-neutral-100 shadow-neutral-drop-shadow"
      >
        <div
          class="min-h-[260px] rounded-t-12 bg-neutral-90 bg-cover bg-center"
          :style="`background-image: url(${getAssetThumb(asset, false)});`"
        ></div>
        <div class="relative grid grid-rows-[max-content,max-content,auto] p-4">
          <div
            class="relative top-[-40px] flex cursor-pointer flex-col rounded-4 bg-neutral-100 p-2 pr-6 shadow-neutral-drop-shadow"
          >
            <div class="paragraph-inter-14-semi-bold">
              {{ asset?.name }}
              <span
                class="paragraph-inter-10-semi-bold relative bottom-[1px] text-neutral-60"
                >{{ asset?.symbol }}</span
              >
            </div>
            <div class="paragraph-ptmono-10-bold mt-1">
              <span v-if="isLsp8(asset)">
                {{ assetTokenId }}
              </span>
              <span v-else>
                {{ $formatMessage('token_owned') }}
                {{ asset?.balance }}
              </span>
            </div>
          </div>
          <NftListCardCreators
            :creators="creators"
            class="relative -top-4 -mt-2"
          />
          <div class="flex items-end">
            <div class="flex w-full justify-end">
              <lukso-button
                v-if="
                  isConnected &&
                  viewedProfile?.address === connectedProfile?.address
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
        <AssetStandardBadge :standard="asset?.standard" />
        <div
          class="paragraph-ptmono-10-bold flex items-center gap-1 text-neutral-60"
        >
          <img
            v-if="asset?.address"
            :src="makeBlockie(asset.address)"
            alt=""
            class="h-3 w-3 rounded-full shadow-neutral-above-shadow-1xl outline outline-neutral-100"
          />
          {{ asset?.address?.slice(0, 6) }}
        </div>
      </div>
    </div>
  </lukso-card>
</template>
