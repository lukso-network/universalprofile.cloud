import { expect, test } from 'vitest'
import { getAssetFileType } from '../assetTypes'

test('getAssetFileType', () => {
  expect(
    getAssetFileType({
      fileType: 'doc',
      url: 'example.url',
    })
  ).toEqual('document')
  expect(
    getAssetFileType({
      fileType: 'png',
      url: 'example.url',
    })
  ).toEqual('image')
  expect(
    getAssetFileType({
      url: 'example.com',
      fileType: '',
    })
  ).toEqual('other')
})
