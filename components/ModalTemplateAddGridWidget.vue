<script setup lang="ts">
const { modal } = useModal()
</script>

<template>
  <AddWidget :properties="modal?.data?.properties" :id="modal?.data?.id" />
</template>
