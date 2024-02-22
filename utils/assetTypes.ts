import { isAddress } from 'web3-utils'

const DOCUMENT_FILE_TYPES = [
  // file extensions
  'doc',
  'docx',
  'pdf',
  'txt',
  // mime types
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]
const MUSIC_FILE_TYPES = [
  // file extensions
  'mp3',
  'wav',
  // mime types
  'audio/mpeg',
  'audio/wav',
]
const VIDEO_FILE_TYPES = [
  // file extensions
  'mp4',
  'mov',
  'avi',
  // mime types
  'video/mp4',
  'video/x-msvideo',
]
const IMAGE_FILE_TYPES = [
  // file extensions
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'tif',
  'tiff',
  // mime types
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/svg+xml',
  'image/tiff',
]
const THREE_DIMENSIONAL_FILE_TYPES = ['gltf', 'glb']

export type AssetFileType =
  | 'document'
  | 'music'
  | 'video'
  | 'image'
  | '3d'
  | 'other'
  | 'contract'

/**
 * Get file type for passed asset.
 * We group most common file/mime types into groups.
 *
 * @param asset
 */
export const getAssetType = (asset: AssetMetadata): AssetFileType => {
  if ('address' in asset && isAddress(asset.address)) {
    return 'contract'
  }

  if ('fileType' in asset) {
    const fileType = asset.fileType.toLowerCase()

    if (DOCUMENT_FILE_TYPES.includes(fileType)) {
      return 'document'
    }

    if (MUSIC_FILE_TYPES.includes(fileType)) {
      return 'music'
    }

    if (VIDEO_FILE_TYPES.includes(fileType)) {
      return 'video'
    }

    if (IMAGE_FILE_TYPES.includes(fileType)) {
      return 'image'
    }

    if (THREE_DIMENSIONAL_FILE_TYPES.includes(fileType)) {
      return '3d'
    }
  }

  return 'other'
}
