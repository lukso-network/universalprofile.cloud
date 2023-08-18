<script setup lang="ts">
import { tokenRoute } from '@/shared/routes'

type Props = {
  asset: Lsp7AssetType
  hasAddress?: boolean
}

const props = defineProps<Props>()

const { profile, status } = useConnectionStore()
const { profile: viewedProfile } = useProfileStore()

const handleShowAsset = () => {
  try {
    assertAddress(profile.address, 'profile')
    assertAddress(props.asset.address, 'asset')
    navigateTo(tokenRoute(profile.address, props.asset.address))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <lukso-card size="small" is-hoverable is-full-width @click="handleShowAsset"
    ><div slot="content" class="p-4">
      <div class="h-7 flex justify-end items-start">
        <lukso-tag size="x-small" background-color="lukso-90">LSP7</lukso-tag>
      </div>
      <div class="flex gap-6">
        <div class="pl-4 flex flex-col items-center">
          <lukso-profile
            profile-url=""
            size="medium"
            :profile-address="asset.address"
            :has-identicon="hasAddress"
          ></lukso-profile>
          <div
            v-if="hasAddress"
            class="paragraph-ptmono-10-bold text-neutral-60 pt-2"
          >
            #{{ asset.address.slice(2, 8) }}
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div class="heading-inter-14-bold pb-1">{{ asset.name }}</div>
          <div class="heading-inter-21-semi-bold flex items-center pb-1">
            {{ $formatNumber(asset.amount)
            }}<span class="paragraph-inter-14-semi-bold text-neutral-60 ml-2">{{
              asset.symbol
            }}</span>
          </div>
          <div class="paragraph-inter-12-regular pb-4">$ 123.24</div>
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
