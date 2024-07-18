import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, beforeEach } from 'vitest'

import SettingsIndex from '../index.vue'

describe('Settings index page', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render the settings index page', async () => {
    const component = await renderSuspended(SettingsIndex)

    expect(component.html()).toMatchSnapshot()
  })
})
