<!-- although we use middleware redirect for this route we still need dummy template to prevent 404 page -->
<script setup>
import UiSearchInput from '@/components/ui/SearchInput.vue'
import UiSectionTitle from '@/components/ui/SectionTitle.vue'

const handleSearchInput = value => {
  if (value) {
    // Do the searching here.
  }
}
</script>

<template>
  <div>
    <h1 class="up-heading">Universal Profiles L16.</h1>
    <h2 class="column up-tagline">
      Platform independent Blockchain Accounts. (Currently in beta)<br />
      Based on the
      <a
        href="https://docs.lukso.tech/standards/universal-profile/lsp0-erc725account"
        target="_blank"
        rel="noreferrer"
        >ERC725 Account</a
      >
      and
      <a
        href="https://docs.lukso.tech/standards/universal-profile/lsp3-universal-profile-metadata"
        rel="noreferrer"
        target="_blank"
        >LSP3</a
      >
      standard.
    </h2>

    <div class="container has-text-centered">
      <p>
        This version of Universal Profile supports the latest
        lsp-smart-contracts and is connected to
        <a
          href="https://docs.lukso.tech/networks/l16-testnet/parameters"
          target="_blank"
          rel=""
          noreferrer
          >LUKSO L16 testnet</a
        >.
      </p>
      <p>
        Profiles and asset fetching is not available as our blockchain cache
        layer is not compatible with latest Smart Contract versions
      </p>
    </div>
    <div class="container">
      <UiSectionTitle>Search profile</UiSectionTitle>
      <div class="actions-container">
        <UiSearchInput
          class="position-search"
          placeholder="Universal Profile address, name or keyword"
          @input-change="handleSearchInput"
        ></UiSearchInput>
      </div>
    </div>
    <!-- <the-featured></the-featured> -->
    <!-- <the-profiles></the-profiles> -->
    <!-- <the-assets></the-assets> -->
  </div>
</template>

<style lang="scss" scoped>
.up-heading {
  // font-size: $font-title * 1.8;
  text-align: center;
}

.up-tagline {
  // font-size: $font-title * 1;
  text-align: center;
}

.has-text-centered {
  text-align: center;
}

.actions-container {
  display: grid;
  width: 100%;
  align-items: center;

  // grid-template-areas: '. search refresh';
  // grid-template-columns: 1fr 8fr 1fr;
  // grid-template-rows: auto;
  justify-items: center;

  // @media (max-width: 768px) {
  //   grid-template-areas: '. search .';
  // }
}

.position-search {
  grid-area: search;
}
</style>
