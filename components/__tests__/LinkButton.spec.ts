import { renderSuspended } from '@nuxt/test-utils/runtime'
import { screen } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import LinkButton from '@/components/LinkButton.vue'

describe('LinkButton', () => {
  const profile: Profile = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
  }

  it('should render empty state', async () => {
    const component = await renderSuspended(LinkButton, {})

    expect(component.html()).toMatchSnapshot()
  })

  it('should render social link', async () => {
    const component = await renderSuspended(LinkButton, {
      props: {
        link: {
          title: 'Twitter',
          url: 'https://twitter.com',
          socialMediaName: 'x',
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render custom link', async () => {
    const component = await renderSuspended(LinkButton, {
      props: {
        link: {
          title: 'Custom',
          url: 'https://example.com',
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should fallback to url when no title', async () => {
    const component = await renderSuspended(LinkButton, {
      props: {
        // @ts-expect-error
        link: {
          url: 'https://example.com',
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  describe('small size', () => {
    it('should render social link', async () => {
      const component = await renderSuspended(LinkButton, {
        props: {
          link: {
            title: 'Twitter',
            url: 'https://twitter.com',
            socialMediaName: 'x',
          },
          size: 'small',
        },
      })

      expect(component.html()).toMatchSnapshot()
    })

    it('should render custom link', async () => {
      const component = await renderSuspended(LinkButton, {
        props: {
          link: {
            title: 'Custom',
            url: 'https://example.com',
          },
          size: 'small',
        },
      })

      expect(component.html()).toMatchSnapshot()
    })
  })
})
