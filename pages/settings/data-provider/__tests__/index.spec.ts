import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

import Index from '../index.vue'
import { useAppStore } from '@/stores/app'

describe('Settings data-provider page', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render with centralized setting', async () => {
    const component = await renderSuspended(Index, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render with decentralized setting', async () => {
    const component = await renderSuspended(Index, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              app: { fetchDataProvider: 'rpc' },
            },
          }),
        ],
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('can change setting', async () => {
    const component = await renderSuspended(Index, {
      global: {
        plugins: [createTestingPinia()],
      },
    })

    expect(component.html()).toMatchSnapshot()
    await component.getByText('Decentralised').click()
    expect(component.html()).toMatchSnapshot()
  })
})
