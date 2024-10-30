<script setup lang="ts">
const { modal } = useModal<Partial<GridWidget>>()
</script>

<template>
  <AddWidget
    :properties="modal?.data?.properties"
    :id="modal?.data?.i"
    :width="modal?.data?.w"
    :height="modal?.data?.h"
    :type="modal?.data?.type"
  />
</template>
