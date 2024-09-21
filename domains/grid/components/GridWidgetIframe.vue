<script setup lang="ts">
type Props = {
  src: string
  title: string
  allow: string
}

defineProps<Props>()

const { formatMessage } = useIntl()
</script>

<template>
  <!-- TODO: Correct design and copy of the Iframe warning once design is finished -->
  <div class="absolute right-[10px] top-[10px] z-10">
    <lukso-tooltip
      variant="light"
      size="medium"
      placement="auto"
      trigger="mouseenter"
      :text="formatMessage('widget_iframe_warning')"
      max-width="300"
      hide-on-click="false"
      offset="10"
      show=""
      show-arrow=""
    >
      <lukso-tag size="x-small" background-color="yellow-65">
        <lukso-icon name="warning-round" size="small"></lukso-icon>
      </lukso-tag>
    </lukso-tooltip>
  </div>
  <iframe
    :src="src"
    :title="title"
    :allow="allow"
    class="m-3 overflow-hidden rounded-12"
    width="100%"
    height="100%"
    frameborder="0"
  ></iframe>
</template>
