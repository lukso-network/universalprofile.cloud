const DOCUMENT_FILE_TYPES = ['doc', 'docx', 'pdf', 'txt']
const MUSIC_FILE_TYPES = ['mp3', 'wav', 'm4a']
const VIDEO_FILE_TYPES = ['mp4', 'mov', 'avi', 'flv']
const IMAGE_FILE_TYPES = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'tif', 'tiff']
const THREE_DIMENSIONAL_FILE_TYPES = ['gltf'] // TODO test other 3d types

export type AssetFileType =
  | 'document'
  | 'music'
  | 'video'
  | 'image'
  | '3d'
  | 'other'

/**
 * Get file type for passed asset.
 * We group most common file/mime types into groups.
 *
 * @param asset
 */
export const getAssetFileType = (asset: AssetMetadata): AssetFileType => {
  if (!asset?.fileType) {
    return 'other'
  }

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

  return 'other'
}
