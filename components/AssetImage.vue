<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

type Props = {
  image?: ImageItem
  alt?: string
}

type Emits = (event: 'on-load') => void

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const isImageLoading = ref(true)
const hasImageError = ref(false)
const imageSrc = ref()
const contentRef = ref()

const handleError = () => {
  if (unref(props.image?.url)) {
    isImageLoading.value = false
    hasImageError.value = true
    imageSrc.value = IMAGE_ERROR_URL
  }
}

const handleLoad = () => {
  isImageLoading.value = false
  emits('on-load')
}

const handleOpenVerificationDocs = (event: Event) => {
  event.stopPropagation()
  window.open(
    'https://docs.lukso.tech/learn/assets#generate-the-json-file',
    '_blank'
  )
}

const isVerificationInvalid = computed(
  () => unref(props.image)?.verified === 'invalid'
)

const isLarge = computed(() => {
  const { width } = useElementSize(contentRef.value)

  return width.value > 150
})

watchEffect(() => {
  imageSrc.value = unref(props.image?.url)
})

onMounted(() => {
  isImageLoading.value = true

  if (props.image?.url) {
    imageSrc.value = unref(props.image?.url)
    hasImageError.value = false
  }
})
</script>

<template>
  <div
    class="relative overflow-hidden bg-neutral-90"
    :class="{
      'animate-pulse': isImageLoading,
    }"
    ref="contentRef"
  >
    <div
      v-if="hasImageError"
      class="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2"
    >
      <img
        src="/images/image-error-icon-grey.svg"
        alt=""
        :class="{
          'w-8': !isLarge,
          'w-10': isLarge,
        }"
      />
      <div
        v-if="isLarge"
        class="paragraph-inter-10-bold-uppercase uppercase text-neutral-75"
      >
        {{ $formatMessage('image_error_missing_message') }}
      </div>
    </div>
    <div
      v-else-if="isVerificationInvalid"
      class="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2"
      :class="{
        'p-10': isLarge,
      }"
    >
      <div class="absolute inset-0 bg-neutral-20/20"></div>
      <div class="z-[1] flex flex-col items-center">
        <img
          src="/images/image-error-icon-white.svg"
          alt=""
          :class="{
            'w-8': !isLarge,
            'w-10': isLarge,
          }"
        />
        <div v-if="isLarge" class="pt-2 text-center text-neutral-100">
          <div class="paragraph-inter-10-bold-uppercase mb-1 uppercase">
            {{ $formatMessage('image_error_invalid_message') }}
          </div>
          <div
            class="paragraph-inter-10-semi-bold"
            @click="handleOpenVerificationDocs"
          >
            <lukso-sanitize
              :html-content="
                $formatMessage('image_error_invalid_documentation', {
                  link: `<span class='underline cursor-pointer'>${$formatMessage('image_error_invalid_documentation_link')}</span>`,
                })
              "
            ></lukso-sanitize>
          </div>
        </div>
      </div>
    </div>
    <img
      class="max-h-[inherit] min-h-[inherit] w-full bg-neutral-90 object-cover opacity-0 animation-fill-forwards"
      :class="{
        'animate-fade-in': !isImageLoading,
        blur: isVerificationInvalid,
      }"
      :src="imageSrc"
      @load="handleLoad"
      @error="handleError"
      loading="lazy"
      :alt="alt"
    />
  </div>
</template>
