import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import AppNavbarProfileSearchGraph from '../AppNavbarProfileSearchGraph.vue'

describe('AppNavbarProfileSearchGraph', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render', async () => {
    const component = await renderSuspended(AppNavbarProfileSearchGraph)

    expect(component.html()).toMatchSnapshot()
  })
})
