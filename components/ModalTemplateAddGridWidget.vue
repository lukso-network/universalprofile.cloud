<script setup lang="ts">
const { modal } = useModal()
</script>

<template>
  <AddWidget
    :properties="modal?.data?.properties"
    :id="modal?.data?.id"
    :width="modal?.data?.width"
    :height="modal?.data?.height"
    :type="modal?.data?.type"
  />
</template>
