<script setup lang="ts">
import { collectibleRoute } from '@/shared/routes'

type Props = {
  asset: Lsp8AssetType
  hasAddress?: boolean
}

const props = defineProps<Props>()

const { profile, status } = useConnectionStore()
const { profile: viewedProfile } = useProfileStore()

const handleShowAsset = () => {
  try {
    assertAddress(profile.address)
    assertAddress(props.asset.collectionAddress)
    navigateTo(collectibleRoute(profile.address, props.asset.collectionAddress))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <lukso-card size="small" is-hoverable is-full-width @click="handleShowAsset"
    ><div slot="content">
      <div class="min-h-[260px] bg-neutral-90 w-100 rounded-t-12"></div>
      <div class="p-4">
        <div
          class="shadow-neutral-drop-shadow p-2 pr-6 rounded-4 inline-flex -top-6 relative bg-neutral-100"
        >
          <lukso-profile size="x-small"></lukso-profile>
          <div class="pl-1">
            <div class="text-neutral-60 paragraph-inter-10-semi-bold">
              {{ $formatMessage('asset_created_by') }}
            </div>
            <lukso-username
              name="John"
              address="0x9671Db683406EE0817B1f5cB6A3b3BD111477457"
              size="x-small"
              class="flex"
              name-color="neutral-20"
            ></lukso-username>
          </div>
        </div>
        <div>
          <div class="paragraph-inter-14-semi-bold">
            {{ asset.collectionName }}
          </div>
          <div class="paragraph-inter-12-semi-bold pb-2">
            1 <span class="text-neutral-60">{{ asset.collectionIcon }}</span>
          </div>
          <div class="flex justify-end w-full">
            <lukso-button
              v-if="
                status.isConnected && viewedProfile.address === profile.address
              "
              size="small"
              variant="secondary"
              >{{ $formatMessage('button_send') }}</lukso-button
            >
          </div>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
