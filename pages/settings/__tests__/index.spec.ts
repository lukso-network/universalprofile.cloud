import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, beforeEach } from 'vitest'

import Index from '../index.vue'

describe('Settings index page', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render the settings index page', async () => {
    const component = await renderSuspended(Index)

    expect(component.html()).toMatchSnapshot()
  })
})
