<script setup lang="ts">
const { formatMessage } = useIntl()
const { closeModal, showModal } = useModal()

type Props = {
  type?: GridWidgetType
  properties?: GridWidgetProperties
  id?: string
  width?: number
  height?: number
  class?: string
}

defineProps<Props>()

const handleSelectWidget = (widgetType: GridWidgetType) => {
  showModal({
    template: 'AddGridWidget',
    data: {
      type: widgetType,
      width: 1,
      height: 1,
    },
    forceOpen: true,
  })
}
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
          @click="handleSelectWidget('IFRAME')"
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
          @click="handleSelectWidget('IMAGE')"
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
          @click="handleSelectWidget('TEXT')"
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

  <!-- Video section -->
  <section
    class="border-b border-b-neutral-90 px-6 py-4 last-of-type:border-b-0 last-of-type:pb-6"
  >
    <div class="paragraph-inter-16-semi-bold mb-4">
      {{ formatMessage('add_widget_section_video') }}
    </div>
    <div class="flex gap-5">
      <!-- Youtube -->
      <lukso-tooltip
        variant="light"
        :text="formatMessage('widget_type_youtube')"
      >
        <img
          src="/images/social-media-youtube.svg"
          alt="Youtube"
          class="size-10 cursor-pointer transition hover:scale-[1.05]"
          @click="handleSelectWidget('YOUTUBE')"
        />
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
          @click="handleSelectWidget('SPOTIFY')"
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
          @click="handleSelectWidget('SOUNDCLOUD')"
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
          @click="handleSelectWidget('X')"
        />
      </lukso-tooltip>

      <!-- Warpcast -->
      <lukso-tooltip
        variant="light"
        :text="formatMessage('widget_type_warpcast')"
      >
        <img
          src="/images/social-media-warpcast.png"
          alt="Warpcast"
          class="size-10 cursor-pointer rounded-full transition hover:scale-[1.05]"
          @click="handleSelectWidget('WARPCAST')"
        />
      </lukso-tooltip>

      <!-- Instagram -->
      <lukso-tooltip
        variant="light"
        :text="formatMessage('widget_type_instagram')"
      >
        <img
          src="/images/social-media-instagram.svg"
          alt="Warpcast"
          class="size-10 cursor-pointer rounded-full transition hover:scale-[1.05]"
          @click="handleSelectWidget('INSTAGRAM')"
        />
      </lukso-tooltip>
    </div>
  </section>
</template>
