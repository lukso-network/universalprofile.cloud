<script setup lang="ts">
import { tv } from 'tailwind-variants'

type Props = {
  label: string
  isActive: boolean
  count?: number
}

const props = defineProps<Props>()

const styleVariants = tv({
  slots: {
    tab: 'heading-inter-17-semi-bold flex items-center',
    counter:
      'paragraph-inter-10-semi-bold ml-2 rounded-4 border border-neutral-20 px-1 py-px',
  },
  variants: {
    isActive: {
      true: {
        tab: 'cursor-default',
        counter: 'bg-neutral-20 text-neutral-100',
      },
      false: {
        tab: 'cursor-pointer opacity-50 transition hover:opacity-100',
        counter: 'bg-transparent text-neutral-20',
      },
    },
  },
})

const styles = computed(() => {
  return styleVariants({
    isActive: props.isActive,
  })
})
</script>

<template>
  <li :class="styles.tab()">
    {{ label }}
    <span v-if="count" :class="styles.counter()">{{ count }}</span>
  </li>
</template>
