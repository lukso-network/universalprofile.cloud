<template>
  <div class="relative">
    <AppPageLoader>
      <div class="mx-auto max-w-content">
        <ProfileCard />
        <div>
          <div class="paragraph-inter-16-regular mt-12 text-center">
            <lukso-sanitize
              :html-content="$formatMessage('buy_lyx_title')"
            ></lukso-sanitize>
          </div>
          <div class="grid gap-6 pt-8 sm:grid-cols-2">
            <BuyLyxCard
              logo-url="/images/transak-logo.png"
              :buy-url="transakBuyLyxUrl()"
              :description="$formatMessage('buy_lyx_card_transak_description')"
            ></BuyLyxCard>
            <BuyLyxCard
              logo-url="/images/ramp-logo.png"
              :buy-url="rampBuyLyxUrl()"
              :description="$formatMessage('buy_lyx_card_ramp_description')"
              class="hidden"
            ></BuyLyxCard>
          </div>
        </div>
      </div>
    </AppPageLoader>
  </div>
</template>
