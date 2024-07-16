import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import AppLinks from '@/components/AppLinks.vue'

describe('AppLinks', () => {
  const profile: Profile = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
  }

  it('should render empty links', async () => {
    const component = await renderSuspended(AppLinks, {
      props: {
        links: [],
      },
      slots: {
        default:
          '<template #default="{ socialMediaLinks }">{{socialMediaLinks}}</template>',
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render socialMediaLinks', async () => {
    const component = await renderSuspended(AppLinks, {
      props: {
        links: [
          {
            title: 'Twitter',
            url: 'https://twitter.com',
          },
          {
            title: 'Custom link',
            url: 'https://example.com',
          },
        ],
      },
      slots: {
        default:
          '<template #default="{ socialMediaLinks }">{{socialMediaLinks}}</template>',
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render otherLinks', async () => {
    const component = await renderSuspended(AppLinks, {
      props: {
        links: [
          {
            title: 'Twitter',
            url: 'https://twitter.com',
          },
          {
            title: 'Custom link',
            url: 'https://example.com',
          },
        ],
      },
      slots: {
        default:
          '<template #default="{ otherLinks }">{{otherLinks}}</template>',
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render hasLinks', async () => {
    const component = await renderSuspended(AppLinks, {
      props: {
        links: [
          {
            title: 'Twitter',
            url: 'https://twitter.com',
          },
          {
            title: 'Custom link',
            url: 'https://example.com',
          },
        ],
      },
      slots: {
        default: '<template #default="{ hasLinks }">{{hasLinks}}</template>',
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render linksParsed', async () => {
    const component = await renderSuspended(AppLinks, {
      props: {
        links: [
          {
            title: 'Twitter',
            url: 'https://twitter.com',
          },
          {
            title: 'Custom link',
            url: 'https://example.com',
          },
        ],
      },
      slots: {
        default:
          '<template #default="{ linksParsed }">{{linksParsed}}</template>',
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
