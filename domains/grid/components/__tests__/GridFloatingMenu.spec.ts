import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { createTestingPinia } from '@pinia/testing'
import GridFloatingMenu from '../GridFloatingMenu.vue'

describe('GridFloatingMenu', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render when user is not connected', async () => {
    const component = await renderSuspended(GridFloatingMenu)
    expect(component.html()).toMatchSnapshot()
  })

  it('should render when user is connected', async () => {
    const component = await renderSuspended(GridFloatingMenu, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              app: { connectedProfileAddress: '0xcafebabe' },
            },
          }),
        ],
      },
    })
    expect(component.html()).toMatchSnapshot()
  })

  it('should render when edit mode is enabled', async () => {
    const component = await renderSuspended(GridFloatingMenu, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              app: { connectedProfileAddress: '0xcafebabe' },
              grid: { isEditingGrid: true },
            },
          }),
        ],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render when has unsaved changes', async () => {
    const component = await renderSuspended(GridFloatingMenu, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              app: { connectedProfileAddress: '0xcafebabe' },
              grid: { isEditingGrid: true, hasUnsavedGrid: true },
            },
          }),
        ],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
