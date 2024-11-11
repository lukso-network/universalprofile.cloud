import { computedAsync } from '@vueuse/core'
import { type ZodEffects, ZodError, type ZodObject } from 'zod'

import type { SelectStringOption } from '@lukso/web-components'

export const useForm = (
  schema?: ZodObject<any> | ZodEffects<ZodObject<any>>,
  initialValues: Record<string, unknown> = {}
) => {
  const inputValues = ref(initialValues)
  const inputErrors = ref<Record<string, any> | undefined>()

  const canSubmit = computedAsync(async () => {
    try {
      await schema?.parseAsync(inputValues.value)
      return true
    } catch (error: unknown) {
      return false
    }
  }, false)

  const getFieldErrorMessage = (field: string, index?: number) => {
    if (index !== undefined) {
      return inputErrors.value?.[field][index]?._errors[0]
    }

    return inputErrors.value?.[field]?._errors[0]
  }

  const handleFieldChange = (customEvent: CustomEvent, field: string) => {
    const value = customEvent.detail?.value
    inputValues.value[field] = value
  }

  const handleSelectChange = (customEvent: CustomEvent, field: string) => {
    const option = customEvent.detail.value as SelectStringOption
    inputValues.value[field] = Number.parseInt(option.id as string)
  }

  const handleArrayChange = (
    customEvent: CustomEvent,
    field: string,
    index: number
  ) => {
    const value = customEvent.detail?.value

    if (Array.isArray(inputValues.value[field])) {
      ;(inputValues.value[field] as unknown[])[index] = value
    }
  }

  const handleFormErrors = (error: unknown) => {
    if (error instanceof ZodError) {
      inputErrors.value = error?.format()
    }
  }

  watch(
    [inputValues],
    async () => {
      try {
        inputErrors.value = undefined
        await schema?.parseAsync(inputValues.value)
      } catch (error: unknown) {
        handleFormErrors(error)

        if (gridLog.enabled) {
          gridLog('Input error', error)
        }
      }
    },
    { deep: true }
  )

  return {
    inputValues,
    inputErrors,
    canSubmit,
    getFieldErrorMessage,
    handleFieldChange,
    handleFormErrors,
    handleSelectChange,
    handleArrayChange,
  }
}
