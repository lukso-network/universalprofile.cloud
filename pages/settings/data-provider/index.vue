<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { formatMessage } = useIntl()
const { fetchDataProvider, isRpc, isGraph } = storeToRefs(useAppStore())

const handleBackToSettings = () => {
  navigateTo(settingsRoute())
}

const handleEnableGraph = () => {
  if (isGraph.value) {
    return
  }

  fetchDataProvider.value = 'graph'
}

const handleEnableRpc = () => {
  if (isRpc.value) {
    return
  }

  fetchDataProvider.value = 'rpc'
}
</script>

<template>
  <AppPageLoader :is-loading="connectedProfile?.isLoading">
    <div class="mx-auto w-full sm:w-[440px]">
      <h1
        class="heading-inter-17-semi-bold group mb-8 flex cursor-pointer items-center gap-1 border-b border-b-neutral-90 pb-6"
        @click="handleBackToSettings"
      >
        <lukso-icon
          name="arrow-left-lg"
          class="transition group-hover:-translate-x-1"
        ></lukso-icon>
        {{ formatMessage('data_provider_page_title') }}
      </h1>

      <!-- Enable GraphQL data provider -->
      <section
        class="group w-full select-none border border-b-0 border-neutral-90 bg-neutral-100 p-4 transition first-of-type:rounded-t-12 last-of-type:rounded-b-12 last-of-type:border-b"
        @click="handleEnableGraph"
        :class="{
          'cursor-pointer': isRpc,
        }"
      >
        <div class="grid grid-cols-[max-content,auto] gap-2">
          <div>
            <lukso-icon
              v-if="isGraph"
              name="complete-filled"
              color="green-54"
              secondary-color="neutral-100"
            ></lukso-icon>
            <div v-else>
              <lukso-icon
                name="empty-outline"
                color="neutral-90"
                class="inline-flex group-hover:hidden"
              ></lukso-icon>
              <lukso-icon
                name="empty-outline"
                color="neutral-80"
                class="hidden group-hover:inline-flex"
              ></lukso-icon>
            </div>
          </div>
          <div class="paragraph-inter-16-semi-bold">
            <h3 class="pb-1">
              {{ formatMessage('data_provider_graph_title') }}
            </h3>
            <p class="paragraph-inter-14-regular text-neutral-40">
              {{ formatMessage('data_provider_graph_description') }}
            </p>
          </div>
        </div>
      </section>

      <!-- Enable RPC data provider -->
      <section
        class="group w-full select-none border border-b-0 border-neutral-90 bg-neutral-100 p-4 transition first-of-type:rounded-t-12 last-of-type:rounded-b-12 last-of-type:border-b"
        @click="handleEnableRpc"
        :class="{
          'cursor-pointer': isGraph,
        }"
      >
        <div class="grid grid-cols-[max-content,auto] gap-2">
          <div>
            <lukso-icon
              v-if="isRpc"
              name="complete-filled"
              color="green-54"
              secondary-color="neutral-100"
            ></lukso-icon>
            <div v-else>
              <lukso-icon
                name="empty-outline"
                color="neutral-90"
                class="inline-flex group-hover:hidden"
              ></lukso-icon>
              <lukso-icon
                name="empty-outline"
                color="neutral-80"
                class="hidden group-hover:inline-flex"
              ></lukso-icon>
            </div>
          </div>
          <div class="paragraph-inter-16-semi-bold">
            <h3 class="pb-1">
              {{ formatMessage('data_provider_rpc_title') }}
            </h3>
            <p class="paragraph-inter-14-regular text-neutral-40">
              {{ formatMessage('data_provider_rpc_description') }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </AppPageLoader>
</template>
