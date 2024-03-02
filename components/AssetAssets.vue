<script setup lang="ts">
type Props = {
  assets: AssetMetadata[]
}

defineProps<Props>()
const { formatMessage } = useIntl()

const assetFileType = (asset: AssetMetadata) => {
  const assetType = getAssetType(asset)

  return {
    ['document']: () => ({
      icon: 'document-outline',
      text: formatMessage('token_asset_type_document'),
    }),
    ['video']: () => ({
      icon: 'video-outline',
      text: formatMessage('token_asset_type_video'),
    }),
    ['music']: () => ({
      icon: 'headset-outline',
      text: formatMessage('token_asset_type_music'),
    }),
    ['image']: () => ({
      icon: 'document-outline',
      text: formatMessage('token_asset_type_image'),
    }),
    ['3d']: () => ({
      icon: 'cube-outline',
      text: formatMessage('token_asset_type_3d'),
    }),
    ['contract']: () => ({
      icon: 'smart-contract-doc',
      text: formatMessage('token_asset_type_contract'),
    }),
    ['other']: () => ({
      icon: 'document-outline',
      text: formatMessage('token_asset_type_other'),
    }),
  }[assetType]()
}

const handlePreviewAsset = (asset: AssetMetadata) => {
  const { showModal } = useModal()
  const assetType = getAssetType(asset)

  return {
    ['document']: () => {
      'url' in asset && window.open(asset.url, '_blank')
    },
    ['video']: () => {
      showModal({
        template: 'AssetVideo',
        data: {
          asset,
        },
        size: 'auto',
      })
    },
    ['music']: () => {
      showModal({
        template: 'AssetAudio',
        data: {
          asset,
        },
        size: 'auto',
      })
    },
    ['image']: () => {
      showModal({
        template: 'AssetImage',
        data: {
          asset,
        },
        size: 'auto',
      })
    },
    ['3d']: () => {
      showModal({
        template: 'Asset3D',
        data: {
          asset,
        },
        size: 'auto',
      })
    },
    ['contract']: async () => {
      if (!('address' in asset)) {
        return
      }
      const tokenId = 'tokenId' in asset && asset.tokenId ? asset.tokenId : '0x'
      assertAddress(asset.address)

      navigateTo(gotoContractRoute(asset.address, tokenId))
    },
    ['other']: () => {
      'url' in asset && window.open(asset.url, '_blank')
    },
  }[assetType]()
}
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-3">
      {{ $formatMessage('token_details_assets') }}
    </div>
    <div class="flex flex-wrap gap-4">
      <div
        v-for="(asset, index) in assets"
        :key="index"
        class="paragraph-inter-10-bold-uppercase flex size-14 cursor-pointer flex-col items-center justify-center rounded-8 border border-neutral-90 bg-neutral-100 bg-cover transition hover:scale-[1.02] hover:shadow-neutral-drop-shadow"
        @click="handlePreviewAsset(asset)"
      >
        <lukso-icon :name="assetFileType(asset).icon" class="mb-1"></lukso-icon>
        {{ assetFileType(asset).text }}
      </div>
    </div>
  </div>
</template>
