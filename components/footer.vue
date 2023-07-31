<script setup lang="ts">
import { routes } from '@/shared/routes'

const handleTermsPage = () => {
  navigateTo(routes.terms)
}
</script>

<template>
  <footer class="bg-neutral-100">
    <div
      class="p-10 grid gap-12 items-center lg:grid-cols-[repeat(2,max-content),auto]"
    >
      <a href="/">
        <img src="/assets/images/lukso-logo.svg" alt="" />
      </a>
      <div
        class="grid gap-6 items-center sm:gap-10 sm:grid-cols-[repeat(2,max-content)]"
      >
        <a
          href="#migration-faq"
          class="nav-apax-12-medium-uppercase text-purple-41 hover:underline hover:text-purple-31"
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
      <div className="flex lg:justify-end">
        <lukso-share></lukso-share>
      </div>
    </div>
    <div
      class="grid grid-cols-[max-content,max-content] px-10 py-7 bg-neutral-95 gap-8"
    >
      <a
        href="https://new-creative-economies.foundation/privacy"
        class="paragraph-inter-12-medium hover:underline"
      >
        {{ $formatMessage('footer_privacy_policy_text') }}
      </a>
      <a
        @click="handleTermsPage"
        class="paragraph-inter-12-medium hover:underline cursor-pointer"
        data-testid="terms-and-conditions"
      >
        {{ $formatMessage('footer_terms_text') }}
      </a>
    </div>
  </footer>
</template>
