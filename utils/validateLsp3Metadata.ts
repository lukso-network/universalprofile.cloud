import {
  ImageMetadata,
  LSP3ProfileMetadata,
  LinkMetadata,
} from '@lukso/lsp-smart-contracts'

export const validateLsp3Metadata = (
  LSP3Metadata: any
): LSP3ProfileMetadata => {
  let profileImage: ImageMetadata[] = []
  let backgroundImage: ImageMetadata[] = []

  const lsp3Profile = LSP3Metadata?.value?.LSP3Profile as LSP3ProfileMetadata
  const name = validateName(lsp3Profile.name)
  const tags = validateTags(lsp3Profile.tags)
  const links = validateLinks(lsp3Profile.links)
  const description = validateDescription(lsp3Profile.description)

  if (lsp3Profile?.profileImage?.length) {
    const imageIsValid = validateImage(lsp3Profile?.profileImage)
    profileImage = imageIsValid ? lsp3Profile?.profileImage : []
  }

  if (lsp3Profile?.backgroundImage?.length) {
    const imageIsValid = validateImage(lsp3Profile?.backgroundImage)
    backgroundImage = imageIsValid ? lsp3Profile?.backgroundImage : []
  }

  return {
    name,
    description,
    profileImage,
    backgroundImage,
    tags,
    links,
  }
}

/**
 * Validate if tags are strings with max 3 for profile
 *
 * @param tags
 * @returns
 */
export const validateTags = (tags: any): string[] => {
  return tags.slice(0, 3).filter((tag: string) => {
    return typeof tag === 'string' && tag !== ''
  })
}

/**
 * Validate if links follow proper format:
 * ```
 * {
 *   title: string,
 *   url: string,
 * }
 * ```
 *
 * @param links
 * @returns
 */
export const validateLinks = (links: any): LinkMetadata[] => {
  return links.filter((link: any) => {
    return (
      typeof link.title === 'string' &&
      link.title !== '' &&
      typeof link.url === 'string' &&
      link.url !== ''
    )
  })
}

/**
 * Validates if the given name is lowercase string
 *
 * @param name - name to be checked
 * @returns - validated name
 */
export const validateName = (name: any): string => {
  return typeof name === 'string' ? name.toLowerCase() : ''
}

/**
 * Validate description is string with max 200 characters
 *
 * @param description - description to validate
 * @returns - validated description
 */
export const validateDescription = (description: any): string => {
  return typeof description === 'string' ? description.slice(0, 200) : ''
}
