/**
 * Creates a deep clone of the provided object.
 *
 * This function serializes the object to a JSON string and then parses it back to a new object,
 * effectively creating a deep copy. Note that this method may not handle all edge cases, such as
 * objects with circular references, functions, or special object types like `Date` or `Map`.
 *
 * @typeParam T - The type of the object to be cloned.
 * @param obj - The object to be cloned.
 * @returns A deep clone of the provided object.
 */
export const cloneObject = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}
