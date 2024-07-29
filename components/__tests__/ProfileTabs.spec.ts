import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import ProfileTabs from '../ProfileTabs.vue'

describe('ProfileTabs', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('renders default state', async () => {
    const component = await renderSuspended(ProfileTabs, {
      props: {
        tabs: [
          {
            id: 'tokens',
            count: 0,
          },
          {
            id: 'collectibles',
            count: 2,
          },
        ],
      },
    })
    expect(component.html()).toMatchSnapshot()
  })

  it('renders active state', async () => {
    const component = await renderSuspended(ProfileTabs, {
      props: {
        tabs: [
          {
            id: 'tokens',
            count: 0,
          },
          {
            id: 'collectibles',
            count: 2,
          },
        ],
        activeTab: 'collectibles',
      },
    })
    expect(component.html()).toMatchSnapshot()
  })
})
