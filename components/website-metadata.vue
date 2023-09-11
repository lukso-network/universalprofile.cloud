<script setup lang="ts">
const { formatMessage } = useIntl()
const title = ref<string>()
const description = ref<string>()
const domain = ref('wallet.universalprofile.cloud')
const url = ref(`https://${domain.value}/`)

onMounted(() => {
  title.value = formatMessage('app_meta_title')
  description.value = formatMessage('app_meta_description')
})
</script>

<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta name="description" :content="description" />
    <Link rel="icon" type="image/png" href="/images/favicon.png" />
    <Link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/images/apple-touch-icon.png"
    />
    <Meta property="og:url" :content="url" />
    <Meta property="og:type" content="website" />
    <Meta property="og:title" :content="title" />
    <Meta property="og:description" :content="description" />
    <Meta property="og:image" :content="url + 'images/social-share.jpg'" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta property="twitter:domain" :content="domain" />
    <Meta property="twitter:url" :content="url" />
    <Meta name="twitter:title" :content="title" />
    <Meta name="twitter:description" :content="description" />
    <Meta name="twitter:image" :content="url + 'images/social-share.jpg'" />
  </Head>
</template>
