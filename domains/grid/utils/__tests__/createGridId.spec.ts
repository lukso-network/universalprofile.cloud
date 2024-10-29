import { describe, expect, it } from 'vitest'
import { createGridId } from '../createGridId'

describe('createGridId', () => {
  it('should generate a unique ID based on the title', () => {
    const gridItem = { title: 'Test Title', gridColumns: 2 }
    const grid: Grid[] = []

    const id = createGridId(gridItem, grid)
    expect(id).toBe('test-title')
  })

  it('should append a number to the ID if the title is not unique', () => {
    const gridItem = { title: 'Test Title', gridColumns: 2 }
    const grid: Grid[] = [
      { id: 'test-title', title: 'Test Title', grid: [], gridColumns: 2 },
    ]

    const id = createGridId(gridItem, grid)
    expect(id).toBe('test-title-0')
  })

  it('should handle an empty title', () => {
    const gridItem = { title: '', gridColumns: 2 }
    const grid: Grid[] = []

    const id = createGridId(gridItem, grid)
    expect(id).toBe('')
  })

  it('should handle special characters in the title', () => {
    const gridItem = { title: 'Test @ Title!', gridColumns: 2 }
    const grid: Grid[] = []

    const id = createGridId(gridItem, grid)
    expect(id).toBe('test-title')
  })
})
