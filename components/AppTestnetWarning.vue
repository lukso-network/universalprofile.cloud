<template>
  <div
    variant="basic"
    size="small"
    class="my-10 flex max-w-2xl overflow-hidden rounded-12 bg-yellow-65 shadow-lg"
  >
    <div slot="content" class="flex items-center p-4">
      <lukso-icon name="warning-round" />
      <div class="paragraph-inter-12-medium pl-4">
        <lukso-sanitize
          :html-content="$formatMessage('beta_warning')"
        ></lukso-sanitize>
      </div>
    </div>
  </div>
</template>
