<script setup lang="ts">
const { formatMessage } = useIntl()
const { closeModal } = useModal()
const { selectWidget } = useWidgetStore()
</script>

<template>
  <div class="border-b border-b-neutral-90">
    <div class="p-6">
      <div class="heading-inter-21-semi-bold flex justify-between">
        {{ formatMessage('add_widget_title') }}
        <ModalCloseButton @click="closeModal" />
      </div>
      <div class="paragraph-inter-14-regular mt-4">
        {{ formatMessage('add_widget_description') }}
      </div>
    </div>
  </div>

  <!-- Custom section -->
  <section
    class="border-b border-b-neutral-90 px-6 py-4 last-of-type:border-b-0 last-of-type:pb-6"
  >
    <div class="paragraph-inter-16-semi-bold mb-4">
      {{ formatMessage('add_widget_section_custom') }}
    </div>
    <div class="flex gap-5">
      <!-- Iframe -->
      <lukso-tooltip
        variant="light"
        :text="formatMessage('widget_type_iframe')"
      >
        <div
          class="flex size-10 cursor-pointer items-center justify-center rounded-full bg-neutral-20 transition hover:scale-[1.05]"
          @click="selectWidget('IFRAME')"
        >
          <lukso-icon
            name="code-outline"
            size="medium"
            color="neutral-100"
          ></lukso-icon>
        </div>
      </lukso-tooltip>

      <!-- Image -->
      <lukso-tooltip variant="light" :text="formatMessage('widget_type_image')">
        <div
          class="flex size-10 cursor-pointer items-center justify-center rounded-full bg-neutral-20 transition hover:scale-[1.05]"
          @click="selectWidget('IMAGE')"
        >
          <lukso-icon
            name="camera"
            size="medium"
            color="neutral-100"
          ></lukso-icon>
        </div>
      </lukso-tooltip>

      <!-- Text -->
      <lukso-tooltip variant="light" :text="formatMessage('widget_type_text')">
        <div
          class="flex size-10 cursor-pointer items-center justify-center rounded-full bg-neutral-20 transition hover:scale-[1.05]"
          @click="selectWidget('TEXT')"
        >
          <lukso-icon
            name="document-outline"
            size="medium"
            color="neutral-100"
          ></lukso-icon>
        </div>
      </lukso-tooltip>
    </div>
  </section>

  <!-- Music section -->
  <section
    class="border-b border-b-neutral-90 px-6 py-4 last-of-type:border-b-0 last-of-type:pb-6"
  >
    <div class="paragraph-inter-16-semi-bold mb-4">
      {{ formatMessage('add_widget_section_music') }}
    </div>
    <div class="flex gap-5">
      <!-- Spotify -->
      <lukso-tooltip
        variant="light"
        :text="formatMessage('widget_type_spotify')"
      >
        <img
          src="/images/social-media-spotify.svg"
          alt="Spotify"
          class="size-10 cursor-pointer transition hover:scale-[1.05]"
          @click="selectWidget('SPOTIFY')"
        />
      </lukso-tooltip>

      <!-- Sound Cloud -->
      <lukso-tooltip
        variant="light"
        :text="formatMessage('widget_type_soundcloud')"
      >
        <img
          src="/images/social-media-soundcloud.svg"
          alt="Sound Cloud"
          class="cursor-pointer transition hover:scale-[1.05]"
          @click="selectWidget('SOUNDCLOUD')"
        />
      </lukso-tooltip>
    </div>
  </section>

  <!-- Social section -->
  <section
    class="border-b border-b-neutral-90 px-6 py-4 last-of-type:border-b-0 last-of-type:pb-6"
  >
    <div class="paragraph-inter-16-semi-bold mb-4">
      {{ formatMessage('add_widget_section_social') }}
    </div>
    <div class="flex gap-5">
      <!-- X -->
      <lukso-tooltip variant="light" :text="formatMessage('widget_type_x')">
        <img
          src="/images/social-media-x.svg"
          alt="X"
          class="cursor-pointer transition hover:scale-[1.05]"
          @click="selectWidget('X')"
        />
      </lukso-tooltip>
    </div>
  </section>
</template>
