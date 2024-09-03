import { renderSuspended } from '@nuxt/test-utils/runtime'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAppStore } from '@/stores/app'
import Index from '../index.vue'

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
    await component.getByText('Read from smart contracts').click()
    expect(component.html()).toMatchSnapshot()
  })
})
