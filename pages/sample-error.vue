<script setup lang="ts">
import * as Sentry from '@sentry/vue'

const error = async () => {
  const transaction = Sentry.startTransaction({
    name: 'Example Frontend Transaction',
  })

  Sentry.configureScope(scope => {
    scope.setSpan(transaction)
  })

  throw new Error('Sentry Example Frontend Error')

  transaction.finish()
}
</script>

<template>
  <button @click="error">Click</button>
</template>
