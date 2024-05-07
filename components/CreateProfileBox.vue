<template>
  <div class="w-full pb-20 md:px-20 lg:px-40">
    <lukso-card is-full-width shadow="small">
      <div slot="content" class="grid gap-14 p-10 lg:grid-cols-2">
        <div>
          <img src="/images/create-up.png" alt="" class="w-full lg:my-[-20%]" />
        </div>
        <div class="flex flex-col items-center text-center lg:order-first">
          <lukso-sanitize
            :html-content="$formatMessage('create_profile_box_text')"
          ></lukso-sanitize>
          <lukso-button
            variant="landing"
            is-link
            :href="myUpDappBaseUrl()"
            target="_self"
            class="mt-4"
            >{{ $formatMessage('create_profile_box_button') }}</lukso-button
          >
        </div>
      </div>
    </lukso-card>
  </div>
</template>
