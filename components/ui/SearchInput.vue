<script lang="ts">
export default defineComponent({
  props: {
    placeholder: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  setup() {
    const searchQuery = ref('');
    const isClearButtonEnabled = computed(() => {
      return searchQuery.value.length > 0;
    });

    return { searchQuery, isClearButtonEnabled };
  },
  methods: {
    clearSearch() {
      this.searchQuery = '';
      this.$emit('input-change', '');
    },
    onSearchChange() {
      this.$emit('input-change', this.searchQuery);
    },
  },
});
</script>

<template>
  <form class="search" @submit.prevent="">
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="placeholder"
      @input="onSearchChange"
    />
    <button
      v-if="isClearButtonEnabled"
      type="button"
      class="image-button search cancel"
      @click="clearSearch"
    ></button>
  </form>
</template>

<style lang="scss" scoped>

.search {
  position: relative;

  input {
    width: 450px;
    padding: 0.6em 1.2em;
    border-radius: 10px;
  }

  input {
    width: 450px;
    height: 44px;
    padding: 0.6em 1.2em;
    padding: 16px;
    background-image: url('/images/icons/search-icon.webp');
    background-position: right 16px center;
    background-repeat: no-repeat;
    background-size: 16px;
    border-radius: 22px;
    // font-family: $IBMPlexMonoSemiBold, Helvetica Neue, Verdana;
    // font-size: $font-small;
    letter-spacing: 2px;

    // mobile
    @media (max-width: 1024px) {
      width: 100%;
      min-width: 300px;
    }
    @media (max-width: 768px) {
      // font-family: $IBMPlexMonoLight, Helvetica Neue, Verdana;
      font-size: 12px;
      font-weight: 400;
      min-width: 300px;
    }
    &::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #717171;
      opacity: 0.5; /* Firefox */
    }
  }
}

.cancel {
  position: absolute;
  top: 0;
  right: 0;
  //   display: none;
  margin-top: -3px;
  margin-left: -47px;
  transform: scale(0.6);
  width: 50px;
  height: 50px;
  // background-color: $color-grey-light;
  background-image: url('/images/icons/cancel-icon.png');
  background-position: 16px 16px;
  background-size: 35%;
  cursor: pointer;
}

.image-button {
  border: 0;
  background-repeat: no-repeat;
  border-radius: 50%;
  // @include t(150ms, 10ms);
  // @include buttonShadow(grey);

  &:active {
    transform: scale(0.9);
  }
}
</style>
