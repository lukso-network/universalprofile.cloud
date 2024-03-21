<script setup lang="ts">
const { isMobile } = useDevice()

type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isLoading)

const tokenLength = computed(() => {
  let tokenLength = 64

  if (isMobile) {
    tokenLength = 36
  }

  return tokenLength
})

const tooltipContent = ref<HTMLElement>()

onMounted(() => {
  tooltipContent.value = document?.getElementById(
    'tooltip-token-id'
  ) as HTMLElement
})
</script>

<template>
  <div v-show="isLoaded">
    <lukso-tag v-if="hasTokenId(asset)" is-rounded class="mb-8">
      <div class="flex items-center">
        <div class="paragraph-ptmono-12-bold mr-2">
          {{
            prefixedTokenId(asset?.tokenId, asset?.tokenIdFormat, tokenLength)
          }}
        </div>
        <lukso-tooltip
          variant="white"
          trigger="mouseenter"
          offset="15"
          :text="tooltipContent"
        >
          <lukso-icon
            name="copy"
            size="small"
            class="cursor-pointer transition-opacity hover:opacity-70"
          ></lukso-icon>
        </lukso-tooltip>
        <div id="tooltip-token-id" class="text-center">
          <div
            class="mb-1 rounded-4 px-2 py-1 hover:cursor-pointer hover:bg-neutral-95"
            :onclick="`navigator.clipboard.writeText('${parseTokenId(asset?.tokenId, asset?.tokenIdFormat)}')`"
          >
            {{ $formatMessage('tooltip_text_copy') }}
          </div>
          <div
            class="rounded-4 px-2 py-1 hover:cursor-pointer hover:bg-neutral-95"
            :onclick="`navigator.clipboard.writeText('${asset?.tokenId}')`"
          >
            {{ $formatMessage('tooltip_text_copy_raw') }}
          </div>
        </div>
      </div>
    </lukso-tag>
  </div>
  <AppPlaceholderLine v-show="!isLoaded" class="mb-8 h-[28px] w-1/3" />
</template>
