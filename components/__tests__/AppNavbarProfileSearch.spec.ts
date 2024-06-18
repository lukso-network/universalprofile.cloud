import { shadowRoot } from './../../node_modules/happy-dom/src/PropertySymbol'
import { renderSuspended, mountSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AppNavbarProfileSearch from '@/components/AppNavbarProfileSearch.vue'

describe('AppNavbarProfileSearch', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render', async () => {
    const component = await renderSuspended(AppNavbarProfileSearch)

    expect(component.html()).toMatchSnapshot()
  })
})
