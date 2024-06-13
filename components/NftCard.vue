<script setup lang="ts">
type Props = {
  asset: Asset
  isFixedHeight: boolean
}

type Emits = {
  (event: 'on-card-click', asset: Asset): void
  (event: 'on-image-click', asset: Asset): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const asset = computed(() => props.asset)
const token = useToken()(asset)
const assetImage = useAssetImage(token, false, 260)
const assetTokenId = computed(() => {
  return prefixedTokenId(token.value?.tokenId, token.value?.tokenIdFormat, 36)
})
</script>

<template>
  <lukso-card
    border-radius="small"
    shadow="small"
    is-full-width
    @click="emits('on-card-click', asset)"
    ><div slot="content">
      <AssetImage
        class="min-h-[360px] cursor-pointer rounded-t-12 md:min-h-[260px]"
        :class="{ 'max-h-[360px] md:max-h-[260px]': isFixedHeight }"
        :image="assetImage"
        @click="emits('on-image-click', asset)"
      />
      <div class="relative p-4">
        <div
          class="paragraph-inter-14-semi-bold flex flex-wrap items-center gap-1 break-word"
        >
          <span v-if="asset">{{ asset?.tokenName }}</span>
          <AppPlaceholderLine v-else class="h-[22px] w-1/2" />
          <span
            v-if="asset"
            class="paragraph-inter-10-semi-bold text-neutral-60"
          >
            {{ asset?.tokenSymbol }}
          </span>
          <AppPlaceholderLine v-else class="h-[12px] w-1/6" />
        </div>
        <div v-if="asset" class="paragraph-ptmono-10-bold mt-1">
          <span v-if="isLsp8(asset)">
            {{ assetTokenId }}
          </span>
        </div>
        <AppPlaceholderLine v-else class="mt-1 h-[11px] w-1/6" />
      </div>
    </div>
  </lukso-card>
</template>
