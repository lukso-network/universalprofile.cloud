<script setup lang="ts">
import type { ProviderName } from '@lukso/web-components'

const providers: ProviderName[] = ['twitter', 'discord', 'github']
</script>

<template>
  <lukso-footer v-if="providers" :providers="JSON.stringify(providers)">
    <div
      slot="links"
      class="grid grid-cols-1 grid-rows-3 items-center gap-4 xl:grid-cols-[repeat(4,max-content)] xl:grid-rows-1 xl:gap-10"
    >
      <AppFooterNetworkSelect />
      <div class="flex items-center gap-10">
        <a
          href="https://docs.lukso.tech/"
          class="nav-apax-12-medium-uppercase text-purple-41 hover:text-purple-31 hover:underline"
          target="_blank"
        >
          {{ $formatMessage('footer_docs_text') }}
        </a>
        <a
          href="https://support.lukso.network/"
          class="nav-apax-12-medium-uppercase text-purple-41 hover:text-purple-31 hover:underline"
          target="_blank"
        >
          {{ $formatMessage('footer_need_help_text') }}
        </a>
      </div>
      <div class="hidden h-4 w-0.5 bg-purple-63 xl:block"></div>
      <div class="flex gap-10">
        <NuxtLink
          :to="privacyPolicyRoute()"
          class="nav-apax-12-medium-uppercase text-purple-41/70 hover:text-purple-31/70 hover:underline"
        >
          {{ $formatMessage('footer_privacy_policy_text') }}
        </NuxtLink>
        <NuxtLink
          :to="termsAndConditionsRoute()"
          class="nav-apax-12-medium-uppercase text-purple-41/70 hover:text-purple-31/70 hover:underline"
        >
          {{ $formatMessage('footer_terms_text') }}
        </NuxtLink>
      </div>
    </div>
  </lukso-footer>
</template>
