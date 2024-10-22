/**
 * Update value from input field event
 *
 * @param customEvent
 * @param field
 * @param values
 */
export const handleFieldChange = (
  customEvent: CustomEvent,
  field: string,
  values?: Record<string, any>
) => {
  const value = customEvent.detail?.value

  if (values) {
    values[field] = value
  }
}

/**
 * Get error message for a field
 *
 * @param errors
 * @param field
 */
export const getFieldErrorMessage = (
  errors: Record<string, any> | undefined,
  field: string
) => {
  if (!errors) {
    return undefined
  }

  return errors[field]?._errors[0]
}
