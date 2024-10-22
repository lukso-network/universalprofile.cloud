const INPUT_FOCUS_DELAY = 10 // small delay for focusing input after element render

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
  const event = customEvent.detail.event
  const target = event.target as HTMLInputElement

  if (values) {
    values[field] = target.value
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

/**
 * Autofocus input field
 *
 * @param name
 */
export const autofocusInput = (name: string) => {
  setTimeout(() => {
    const input = document?.querySelector(name) as unknown as HTMLElement

    ;(
      input?.shadowRoot?.querySelector('input[autofocus]') as HTMLInputElement
    )?.focus()
  }, INPUT_FOCUS_DELAY)
}
