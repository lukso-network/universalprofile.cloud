import { getPropertiesFromGroups } from './gridParser'

// Common iframe attributes regex patterns
const COMMON_IFRAME_ATTRIBUTES: Record<string, string> = {
  style: '(?:style="(?<style>[^"]+)")',
  width: '(?:width="(?<width>\\d+(?:%)?)")',
  height: '(?:height="(?<height>\\d+(?:%)?)")',
  frameBorder: '(?:frameBorder="(?<frameBorder>\\d+)")',
  allow: '(?:allow="(?<allow>[^"]+)")',
  loading: '(?:loading="(?<loading>[^"]+)")',
  allowfullscreen: '(?<allowfullscreen>allowfullscreen)',
  title: '(?:title="(?<title>[^"]+)")',
  referrerpolicy: '(?:referrerpolicy="(?<referrerpolicy>[^"]+)")',
  sandbox: '(?:sandbox="(?<sandbox>[^"]+)")',
}

// Factory function to create platform-specific regex with common attributes
export const createIframeRegex = (
  srcPattern: string,
  additionalAttributes: string[] = []
) => {
  const selectedAttributes = [
    ...additionalAttributes,
    'style',
    'width',
    'height',
    'frameBorder',
    'allow',
    'loading',
    'allowfullscreen',
  ]
  const attributePatterns = selectedAttributes
    .map(
      (attr: keyof typeof COMMON_IFRAME_ATTRIBUTES) =>
        COMMON_IFRAME_ATTRIBUTES[attr]
    )
    .filter(Boolean)
    .join('|')

  return new RegExp(`${srcPattern}|${attributePatterns}`, 'g')
}

// Generic callback processor for iframe attributes
export const processIframeAttributes = (
  matches: RegExpMatchArray[],
  platformDefaults: {
    createSrc: (properties: Record<string, any>) => string
    defaultAllow?: string
    additionalProcessing?: (
      properties: Record<string, any>
    ) => Record<string, any>
  }
) => {
  const properties = getPropertiesFromGroups(matches)
  const {
    style,
    width,
    height,
    frameBorder,
    allow,
    loading,
    allowfullscreen,
    ...platformSpecific
  } = properties

  const baseProperties = {
    src: platformDefaults.createSrc(platformSpecific),
    // ...platformSpecific,
    ...(style && { style }),
    ...(width && { width }),
    ...(height && { height }),
    ...(frameBorder && { frameBorder: parseInt(frameBorder) }),
    ...((allow && { allow }) ||
      (platformDefaults.defaultAllow && {
        allow: platformDefaults.defaultAllow,
      })),
    ...(loading && { loading }),
    ...(allowfullscreen && { allowfullscreen: true }),
  }

  return platformDefaults.additionalProcessing
    ? platformDefaults.additionalProcessing(baseProperties)
    : baseProperties
}
