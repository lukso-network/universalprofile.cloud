<script setup lang="ts">
import { ProviderName } from '@lukso/web-components/dist/components/lukso-share'

const providers: ProviderName[] = ['twitter', 'discord', 'github']
</script>

<template>
  <lukso-footer :providers="providers">
    <div
      slot="links"
      class="grid gap-4 items-center grid-cols-1 grid-rows-3 xl:grid-cols-[repeat(4,max-content)] xl:gap-10 xl:grid-rows-1"
    >
      <AppFooterNetworkSelect />
      <div class="flex gap-10 items-center">
        <a
          href="https://docs.lukso.tech/"
          class="nav-apax-12-medium-uppercase text-purple-41 hover:underline hover:text-purple-31"
          target="_blank"
        >
          {{ $formatMessage('footer_docs_text') }}
        </a>
        <a
          href="https://lukso.network/faq"
          class="nav-apax-12-medium-uppercase text-purple-41 hover:underline hover:text-purple-31"
          target="_blank"
        >
          {{ $formatMessage('footer_faq_text') }}
        </a>
        <a
          :href="$formatMessage('footer_need_help_url')"
          class="nav-apax-12-medium-uppercase text-purple-41 hover:underline hover:text-purple-31"
        >
          {{ $formatMessage('footer_need_help_text') }}
        </a>
      </div>
      <div class="hidden w-0.5 h-4 bg-purple-63 xl:block"></div>
      <div class="flex gap-10">
        <a
          href="https://new-creative-economies.foundation/privacy"
          class="nav-apax-12-medium-uppercase text-purple-41/70 hover:underline hover:text-purple-31/70"
          target="_blank"
        >
          {{ $formatMessage('footer_privacy_policy_text') }}
        </a>
        <a
          href="https://lukso.network/terms"
          class="nav-apax-12-medium-uppercase text-purple-41/70 hover:underline hover:text-purple-31/70"
          target="_blank"
        >
          {{ $formatMessage('footer_terms_text') }}
        </a>
      </div>
    </div>
  </lukso-footer>
</template>
