import { mountSuspended, renderSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shadowRoot } from './../../node_modules/happy-dom/src/PropertySymbol'

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
