import { describe, expect, it } from 'vitest'

import { purifyGridConfig } from '../purifyGridConfig'

describe('purifyGridConfig', () => {
  it('should return an empty array for empty configuration', async () => {
    const result = await purifyGridConfig([])
    expect(result).toEqual([])
  })

  it('should return valid grid', async () => {
    const result = await purifyGridConfig([
      {
        title: 'grid-1',
        gridColumns: 2,
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
      {
        title: 'grid-2',
        gridColumns: 3,
        grid: [
          {
            type: 'IMAGE',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
    expect(result).toEqual([
      {
        title: 'grid-1',
        gridColumns: 2,
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
      {
        title: 'grid-2',
        gridColumns: 3,
        grid: [
          {
            type: 'IMAGE',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
  })

  it('should return default column number when value is missing', async () => {
    const result = await purifyGridConfig([
      {
        title: 'grid-1',
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
    expect(result).toEqual([
      {
        title: 'grid-1',
        gridColumns: 2,
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
  })

  it('should return default title when value is missing', async () => {
    const result = await purifyGridConfig([
      {
        gridColumns: 2,
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
    expect(result).toEqual([
      {
        title: 'Main',
        gridColumns: 2,
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
  })

  it('should return empty widget array when value is missing', async () => {
    const result = await purifyGridConfig([
      {
        title: 'grid-1',
        gridColumns: 2,
      },
    ])
    expect(result).toEqual([
      {
        title: 'grid-1',
        gridColumns: 2,
        grid: [],
      },
    ])
  })

  it('should recreate grid from invalid element', async () => {
    const result = await purifyGridConfig([
      {
        asdf: 'asdf',
      },
    ])
    expect(result).toEqual([
      {
        title: 'Main',
        gridColumns: 2,
        grid: [],
      },
    ])
  })

  it('should recreate widget width and height if missing', async () => {
    const result = await purifyGridConfig([
      {
        grid: [
          {
            type: 'IFRAME',
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
    expect(result).toEqual([
      {
        title: 'Main',
        gridColumns: 2,
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
  })

  it('should remove widget without type', async () => {
    const result = await purifyGridConfig([
      {
        grid: [
          {
            type: 'IFRAME',
            properties: {
              src: 'https://example.com',
            },
          },
          {
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
    expect(result).toEqual([
      {
        title: 'Main',
        gridColumns: 2,
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
  })

  it('should remove widget without properties', async () => {
    const result = await purifyGridConfig([
      {
        grid: [
          {
            type: 'IFRAME',
            properties: {
              src: 'https://example.com',
            },
          },
          {
            type: 'IMAGE',
          },
        ],
      },
    ])
    expect(result).toEqual([
      {
        title: 'Main',
        gridColumns: 2,
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://example.com',
            },
          },
        ],
      },
    ])
  })
})
