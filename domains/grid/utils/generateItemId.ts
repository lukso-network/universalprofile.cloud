import { v4 as uuidv4 } from 'uuid'

/**
 * Generate unique item id
 *
 * @returns
 */
export const generateItemId = (): string => {
  return uuidv4()
}
