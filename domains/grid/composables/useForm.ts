import { computedAsync } from '@vueuse/core'
import { ZodError } from 'zod'

export const useForm = (
  schemaMap?: GridSchemaMap,
  initialValues: Record<string, unknown> = {}
) => {
  const inputValues = ref(initialValues)
  const inputErrors = ref<Record<string, any> | undefined>()

  const canSubmit = computedAsync(async () => {
    try {
      await schemaMap?.input?.parseAsync(inputValues.value)
      return true
    } catch {
      return false
    }
  }, false)

  const getFieldErrorMessage = (field: string) => {
    return inputErrors.value?.[field]?._errors[0]
  }

  const handleFieldChange = (customEvent: CustomEvent, field: string) => {
    const value = customEvent.detail?.value

    inputValues.value[field] = value
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
        await schemaMap?.input?.parseAsync(inputValues.value)
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
  }
}
