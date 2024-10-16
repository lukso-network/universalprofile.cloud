import { describe, expect, it } from 'vitest'
import { createGridId } from '../createGridId'

describe('createGridId', () => {
  it('should generate a unique ID based on the title', () => {
    const gridItem = { title: 'Test Title' }
    const config: Grid<GridWidget>[] = []

    const id = createGridId(gridItem, config)
    expect(id).toBe('test-title')
  })

  it('should append a number to the ID if the title is not unique', () => {
    const gridItem = { title: 'Test Title' }
    const config: Grid<GridWidget>[] = [
      { id: 'test-title', title: 'Test Title', grid: [] },
    ]

    const id = createGridId(gridItem, config)
    expect(id).toBe('test-title-0')
  })

  it('should handle an empty title', () => {
    const gridItem = { title: '' }
    const config: Grid<GridWidget>[] = []

    const id = createGridId(gridItem, config)
    expect(id).toBe('')
  })

  it('should handle special characters in the title', () => {
    const gridItem = { title: 'Test @ Title!' }
    const config: Grid<GridWidget>[] = []

    const id = createGridId(gridItem, config)
    expect(id).toBe('test-title')
  })
})
