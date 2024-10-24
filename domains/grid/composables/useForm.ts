import { computedAsync } from '@vueuse/core'
import { ZodEffects, ZodError, type ZodObject } from 'zod'

export const useForm = (
  schema?: ZodObject<any> | ZodEffects<ZodObject<any>>,
  initialValues: Record<string, any> = {}
) => {
  const inputValues = ref(initialValues)
  const inputErrors = ref<Record<string, any> | undefined>()

  const canSubmit = computedAsync(async () => {
    try {
      await schema?.parseAsync(inputValues.value)
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
        await schema?.parseAsync(inputValues.value)
      } catch (error: unknown) {
        handleFormErrors(error)
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
