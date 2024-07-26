import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'

import ProfileTabsItem from '../ProfileTabsItem.vue'

describe('ProfileTabsItem', () => {
  it('renders default state', async () => {
    const component = await renderSuspended(ProfileTabsItem, {
      props: {
        label: 'Test Label',
        isActive: false,
        count: 0,
      },
    })
    expect(component.html()).toMatchSnapshot()
  })

  it('renders active state', async () => {
    const component = await renderSuspended(ProfileTabsItem, {
      props: {
        label: 'Test Label',
        isActive: true,
        count: 0,
      },
    })
    expect(component.html()).toMatchSnapshot()
  })

  it('renders count', async () => {
    const component = await renderSuspended(ProfileTabsItem, {
      props: {
        label: 'Test Label',
        isActive: false,
        count: 2,
      },
    })
    expect(component.html()).toMatchSnapshot()
  })
})
