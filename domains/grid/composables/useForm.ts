import { ZodError, type ZodObject } from 'zod'

export const useForm = (
  schema?: ZodObject<any>,
  initialValues: Record<string, any> = {}
) => {
  const inputValues = ref(initialValues)
  const inputErrors = ref<Record<string, any> | undefined>()

  const canSubmit = computed(() => {
    try {
      schema?.parse(inputValues.value)
      return true
    } catch {
      return false
    }
  })

  const getFieldErrorMessage = (field: string) => {
    return inputErrors.value?.[field]?._errors[0]
  }

  const handleFieldChange = (customEvent: CustomEvent, field: string) => {
    const value = customEvent.detail?.value

    inputValues.value[field] = value
  }

  watch(
    [inputValues],
    () => {
      try {
        inputErrors.value = undefined
        schema?.parse(inputValues.value)
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          inputErrors.value = error?.format()
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
  }
}
